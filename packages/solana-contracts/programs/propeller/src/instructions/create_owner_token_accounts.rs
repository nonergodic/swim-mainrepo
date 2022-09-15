pub use switchboard_v2::{AggregatorAccountData, SwitchboardDecimal, SWITCHBOARD_PROGRAM_ID};
use {
    crate::{
        constants::LAMPORTS_PER_SOL_DECIMAL, get_marginal_price_decimal, get_token_bridge_mint_decimals, FeeTracker,
    },
    anchor_spl::{
        associated_token::{get_associated_token_address, AssociatedToken},
        token::Transfer,
    },
    num_traits::{FromPrimitive, ToPrimitive},
    rust_decimal::Decimal,
    solana_program::{instruction::Instruction, program::invoke_signed},
};
use {
    crate::{
        deserialize_message_payload,
        // env::*,
        error::*,
        get_message_data,
        get_transfer_with_payload_from_message_account,
        hash_vaa,
        state::{PropellerClaim, PropellerMessage, *},
        token_bridge::TokenBridge,
        token_id_map::{PoolInstruction, TokenIdMap},
        ClaimData,
        PayloadTransferWithPayload,
        PostVAAData,
        PostedVAAData,
        Propeller,
        RawSwimPayload,
        TOKEN_COUNT,
    },
    anchor_lang::{prelude::*, solana_program::program::invoke},
    anchor_spl::{
        token,
        token::{Mint, Token, TokenAccount},
    },
    std::convert::TryInto,
    two_pool::state::TwoPool,
};

#[derive(Accounts)]
pub struct PropellerCreateOwnerTokenAccounts<'info> {
    #[account(
    seeds = [ b"propeller".as_ref(), propeller.token_bridge_mint.as_ref()],
    bump = propeller.bump
    )]
    pub propeller: Box<Account<'info, Propeller>>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
    seeds = [ b"redeemer".as_ref()],
    bump = propeller.redeemer_bump
    )]
    /// this used to be "to_owner".
    /// redeemer will be PDA derived from ["redeemer"], seeds::program = propeller::id()
    /// will have to be signed when it invokes complete_transfer_with_payload
    /// if complete transfer with payload not meant to be handled by a contract redeemer will be the same as vaa.to
    ///     (NOT the `to` account)
    pub redeemer: SystemAccount<'info>,
    #[account(
    mut,
    token::mint = propeller.token_bridge_mint,
    token::authority = redeemer,
    )]
    pub redeemer_escrow: Box<Account<'info, TokenAccount>>,
    #[account(
    mut,
    token::mint = propeller.token_bridge_mint,
    token::authority = propeller,
    )]
    pub fee_vault: Box<Account<'info, TokenAccount>>,

    #[account(
    mut,
    seeds = [
    b"propeller".as_ref(),
    b"fee".as_ref(),
    propeller.token_bridge_mint.as_ref(),
    payer.key().as_ref()
    ],
    bump = fee_tracker.bump
    )]
    pub fee_tracker: Account<'info, FeeTracker>,

    #[account(
    seeds = [
    propeller_message.vaa_emitter_address.as_ref(),
    propeller_message.vaa_emitter_chain.to_be_bytes().as_ref(),
    propeller_message.vaa_sequence.to_be_bytes().as_ref(),
    ],
    bump,
    seeds::program = propeller.token_bridge().unwrap()
    )]
    /// CHECK: WH Claim account
    pub claim: UncheckedAccount<'info>,

    //TODO: do i really need to pass in the original message account?
    // seeds = [ b"PostedVAA".as_ref(), hash_vaa(vaa).as_ref() ],
    // #[account(
    //   seeds = [
    //     b"PostedVAA".as_ref(),
    //     hash_vaa(&vaa).as_ref()
    //   ],
    //   bump = propeller_message.wh_message_bump,
    //   seeds::program = propeller.wormhole()?
    // )]
    /// CHECK: MessageData with Payload
    pub message: UncheckedAccount<'info>,

    #[account(
    mut,
    seeds = [
    b"propeller".as_ref(),
    claim.key().as_ref(),
    message.key().as_ref(),
    ],
    bump = propeller_message.bump
    )]
    pub propeller_message: Box<Account<'info, PropellerMessage>>,

    #[account(
    mut,
    seeds = [
    b"two_pool".as_ref(),
    pool_token_0_mint.key().as_ref(),
    pool_token_1_mint.key().as_ref(),
    pool_lp_mint.key().as_ref(),
    ],
    bump = pool.bump,
    seeds::program = two_pool_program.key()
    )]
    pub pool: Box<Account<'info, TwoPool>>,
    pub pool_token_0_mint: Box<Account<'info, Mint>>,
    pub pool_token_1_mint: Box<Account<'info, Mint>>,
    pub pool_lp_mint: Box<Account<'info, Mint>>,

    pub user: SystemAccount<'info>,
    #[account(mut)]
    /// CHECK: may possibly need to initialize
    pub user_pool_token_0_account: UncheckedAccount<'info>,
    #[account(mut)]
    /// CHECK: may possibly need to initialize
    pub user_pool_token_1_account: UncheckedAccount<'info>,
    #[account(mut)]
    /// CHECK: may possibly need to initialize
    pub user_lp_token_account: UncheckedAccount<'info>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,

    /* for sol -> token_bridge_mint conversion */
    #[account(
    constraint =
    *aggregator.to_account_info().owner == SWITCHBOARD_PROGRAM_ID @ PropellerError::InvalidSwitchboardAccount
    )]
    pub aggregator: AccountLoader<'info, AggregatorAccountData>,

    #[account(
    mut,
    seeds = [
    b"two_pool".as_ref(),
    marginal_price_pool_token_0_account.mint.as_ref(),
    marginal_price_pool_token_1_account.mint.as_ref(),
    marginal_price_pool_lp_mint.key().as_ref(),
    ],
    bump = marginal_price_pool.bump,
    seeds::program = two_pool_program.key()
    )]
    pub marginal_price_pool: Box<Account<'info, TwoPool>>,
    pub marginal_price_pool_token_0_account: Box<Account<'info, TokenAccount>>,
    pub marginal_price_pool_token_1_account: Box<Account<'info, TokenAccount>>,
    pub marginal_price_pool_lp_mint: Box<Account<'info, Mint>>,

    pub two_pool_program: Program<'info, two_pool::program::TwoPool>,
}

impl<'info> PropellerCreateOwnerTokenAccounts<'info> {
    pub fn accounts(ctx: &Context<PropellerCreateOwnerTokenAccounts>) -> Result<()> {
        require_keys_eq!(ctx.accounts.user.key(), ctx.accounts.propeller_message.owner);
        let expected_user_token_0_ata =
            get_associated_token_address(&ctx.accounts.user.key(), &ctx.accounts.pool_token_0_mint.key());
        require_keys_eq!(expected_user_token_0_ata, ctx.accounts.user_pool_token_0_account.key());
        let expected_user_token_1_ata =
            get_associated_token_address(&ctx.accounts.user.key(), &ctx.accounts.pool_token_1_mint.key());
        require_keys_eq!(expected_user_token_1_ata, ctx.accounts.user_pool_token_1_account.key());
        let expected_user_lp_ata =
            get_associated_token_address(&ctx.accounts.user.key(), &ctx.accounts.pool_lp_mint.key());
        require_keys_eq!(expected_user_lp_ata, ctx.accounts.user_lp_token_account.key());
        msg!("Passed PropellerCreateOwnerTokenAccounts::accounts() check");
        Ok(())
    }
    pub fn validate(&self) -> Result<()> {
        require_keys_eq!(self.user.key(), self.propeller_message.owner);
        let expected_user_token_0_ata = get_associated_token_address(&self.user.key(), &self.pool_token_0_mint.key());
        require_keys_eq!(expected_user_token_0_ata, self.user_pool_token_0_account.key());
        let expected_user_token_1_ata = get_associated_token_address(&self.user.key(), &self.pool_token_1_mint.key());
        require_keys_eq!(expected_user_token_1_ata, self.user_pool_token_1_account.key());
        let expected_user_lp_ata = get_associated_token_address(&self.user.key(), &self.pool_lp_mint.key());
        require_keys_eq!(expected_user_lp_ata, self.user_lp_token_account.key());
        Ok(())
    }
}

//TODO: allow this regardless of gasKickstart or only if gasKickstart?
// possible !gasKickstart but they don't have all the accounts needed (e.g. token_account for token_bridge_mint)
/// Note: we still allow this to be called even if all token accounts already exist. But since this is wasteful,
/// we penalize the engine by not reimbursing them anything in that situation so that they are incentivized to
/// check if any of the require token accounts don't exist.
pub fn handle_propeller_create_owner_token_accounts(ctx: Context<PropellerCreateOwnerTokenAccounts>) -> Result<()> {
    let mut create_owner_token_account_total_fees_in_lamports = 0u64;

    let token_program = ctx.accounts.token_program.to_account_info();
    let payer = ctx.accounts.payer.to_account_info();
    let user = ctx.accounts.user.to_account_info();
    let system_program = ctx.accounts.system_program.to_account_info();
    let init_token_account_0_fees = initialize_user_ata_and_get_fees(
        ctx.accounts.user_pool_token_0_account.to_account_info().clone(),
        payer.clone(),
        user.clone(),
        ctx.accounts.pool_token_0_mint.to_account_info().clone(),
        system_program.clone(),
        token_program.clone(),
    )?;
    msg!("init_token_account_0_fees: {}", init_token_account_0_fees);
    let init_token_account_1_fees = initialize_user_ata_and_get_fees(
        ctx.accounts.user_pool_token_1_account.to_account_info().clone(),
        payer.clone(),
        user.clone(),
        ctx.accounts.pool_token_1_mint.to_account_info().clone(),
        system_program.clone(),
        token_program.clone(),
    )?;
    let init_lp_token_account_fees = initialize_user_ata_and_get_fees(
        ctx.accounts.user_lp_token_account.to_account_info().clone(),
        payer.clone(),
        user.clone(),
        ctx.accounts.pool_lp_mint.to_account_info().clone(),
        system_program.clone(),
        token_program.clone(),
    )?;
    create_owner_token_account_total_fees_in_lamports = init_token_account_0_fees
        .checked_add(init_token_account_1_fees)
        .and_then(|f| f.checked_add(init_lp_token_account_fees))
        .ok_or(PropellerError::IntegerOverflow)?;

    msg!(
        "
    {}(init_token_account_0_fees) +
    {}(init_token_account_1_fees) +
    {}(init_lp_token_account_fees)
    = {}(create_owner_token_account_total_fees_in_lamports)
    ",
        init_token_account_0_fees,
        init_token_account_1_fees,
        init_lp_token_account_fees,
        create_owner_token_account_total_fees_in_lamports
    );
    if create_owner_token_account_total_fees_in_lamports == 0 {
        msg!("No accounts need to be initialized. Returning early");
        return Ok(());
    }
    let create_owner_token_account_total_fees_in_token_bridge_mint =
        get_fees_in_token_bridge_mint(create_owner_token_account_total_fees_in_lamports, &ctx)?;
    let fee_tracker = &mut ctx.accounts.fee_tracker;
    fee_tracker.fees_owed = fee_tracker
        .fees_owed
        .checked_add(create_owner_token_account_total_fees_in_token_bridge_mint)
        .ok_or(PropellerError::IntegerOverflow)?;
    let cpi_accounts = Transfer {
        from: ctx.accounts.redeemer_escrow.to_account_info(),
        to: ctx.accounts.fee_vault.to_account_info(),
        authority: ctx.accounts.redeemer.to_account_info(),
    };
    token::transfer(
        CpiContext::new_with_signer(
            token_program.clone(),
            cpi_accounts,
            &[&[&b"redeemer".as_ref(), &[ctx.accounts.propeller.redeemer_bump]]],
        ),
        create_owner_token_account_total_fees_in_token_bridge_mint,
    )?;
    let transfer_amount = ctx.accounts.propeller_message.transfer_amount;
    let new_transfer_amount = transfer_amount
        .checked_sub(create_owner_token_account_total_fees_in_token_bridge_mint)
        .ok_or(error!(PropellerError::InsufficientFunds))?;

    msg!(
        "transfer_amount: {} - fees_in_token_bridge: {} = {}",
        transfer_amount,
        create_owner_token_account_total_fees_in_token_bridge_mint,
        new_transfer_amount
    );
    ctx.accounts.propeller_message.transfer_amount = new_transfer_amount;

    Ok(())
}

fn initialize_user_ata_and_get_fees<'info>(
    user_unchecked_token_account: AccountInfo<'info>,
    payer: AccountInfo<'info>,
    user: AccountInfo<'info>,
    mint: AccountInfo<'info>,
    system_program: AccountInfo<'info>,
    token_program: AccountInfo<'info>,
) -> Result<u64> {
    //TODO: figure out actual cost of create ata txn.
    let create_ata_fee = 10000u64;
    let ata_data_len = user_unchecked_token_account.data_len();
    if ata_data_len == TokenAccount::LEN {
        let token_account =
            TokenAccount::try_deserialize(&mut &**user_unchecked_token_account.data.try_borrow_mut().unwrap())?;
        require_keys_eq!(token_account.owner, user.key(), PropellerError::IncorrectOwnerForCreateTokenAccount);
        return Ok(0u64);
    } else if ata_data_len != 0 {
        //TODO: spl_token_2022?
        // panic!("data_len != 0 && != TokenAcount::LEN");
        return err!(PropellerError::InvalidTokenAccountDataLen);
    } else {
        let ix = spl_associated_token_account::instruction::create_associated_token_account(
            &payer.key(),
            &user.key(),
            &mint.key(),
        );
        invoke(&ix, &[payer, user_unchecked_token_account, user, mint, system_program, token_program])?;
        let fees = Rent::get()?.minimum_balance(TokenAccount::LEN) + create_ata_fee;
        Ok(fees)
    }
}

fn get_fees_in_token_bridge_mint(
    fee_in_lamports: u64,
    ctx: &Context<PropellerCreateOwnerTokenAccounts>,
) -> Result<u64> {
    msg!("fee_in_lamports: {:?}", fee_in_lamports);

    let propeller = &ctx.accounts.propeller;
    let lp_mint_key = ctx.accounts.marginal_price_pool_lp_mint.key();

    let token_bridge_mint_key = propeller.token_bridge_mint;
    let cpi_ctx = CpiContext::new(
        ctx.accounts.two_pool_program.to_account_info(),
        two_pool::cpi::accounts::MarginalPrices {
            pool: ctx.accounts.marginal_price_pool.to_account_info(),
            pool_token_account_0: ctx.accounts.marginal_price_pool_token_0_account.to_account_info(),
            pool_token_account_1: ctx.accounts.marginal_price_pool_token_1_account.to_account_info(),
            lp_mint: ctx.accounts.marginal_price_pool_lp_mint.to_account_info(),
        },
    );
    let result = two_pool::cpi::marginal_prices(cpi_ctx)?;
    // let marginal_prices = result.get().marginal_prices;
    let marginal_prices = result.get();

    msg!("marginal_prices: {:?}", marginal_prices);

    let marginal_price: Decimal = get_marginal_price_decimal(
        &ctx.accounts.marginal_price_pool,
        &marginal_prices,
        propeller.marginal_price_pool_token_index as usize,
        &ctx.accounts.marginal_price_pool_lp_mint.key(),
        &token_bridge_mint_key,
    )?;
    msg!("marginal_price: {}", marginal_price);

    //swimUSD is lp token of marginal price pool
    let mut res = 0u64;
    let feed = &ctx.accounts.aggregator.load()?;

    // get result
    // note - for tests this is currently hardcoded to 100
    // this val is SOL/USD price
    // 100 => 1 SOL/100 USD (usdc)
    // let v2 = feed.get_result()?.try_into()?;
    let sol_usd_price: Decimal = feed.get_result()?.try_into()?;
    let name = feed.name;

    let lamports_usd_price =
        sol_usd_price.checked_div(LAMPORTS_PER_SOL_DECIMAL).ok_or(PropellerError::IntegerOverflow)?;
    msg!("sol_usd_price:{},lamports_usd_price: {}", sol_usd_price, lamports_usd_price);
    // check whether the feed has been updated in the last 300 seconds
    feed.check_staleness(
        Clock::get().unwrap().unix_timestamp,
        // 300
        i64::MAX,
    )
    .map_err(|_| error!(PropellerError::StaleFeed))?;
    // check feed does not exceed max_confidence_interval
    // if let Some(max_confidence_interval) = params.max_confidence_interval {
    // 	feed.check_confidence_interval(SwitchboardDecimal::from_f64(max_confidence_interval))
    // 	.map_err(|_| error!(PropellerError::ConfidenceIntervalExceeded))?;
    // }

    let marginal_price: Decimal = get_marginal_price_decimal(
        &ctx.accounts.marginal_price_pool,
        &marginal_prices,
        propeller.marginal_price_pool_token_index as usize,
        &ctx.accounts.marginal_price_pool_lp_mint.key(),
        &token_bridge_mint_key,
    )?;
    let fee_in_lamports_decimal = Decimal::from_u64(fee_in_lamports).ok_or(PropellerError::ConversionError)?;
    msg!("fee_in_lamports(u64): {:?} fee_in_lamports_decimal: {:?}", fee_in_lamports, fee_in_lamports_decimal);
    let fee_in_token_bridge_mint_decimal = marginal_price
        .checked_mul(lamports_usd_price)
        .and_then(|v| v.checked_mul(fee_in_lamports_decimal))
        .ok_or(PropellerError::IntegerOverflow)?;
    // .checked_mul(Decimal::from_u64(fee_in_lamports).ok_or(PropellerError::IntegerOverflow)?)
    // .ok_or(PropellerError::IntegerOverflow)?;
    let token_bridge_mint_decimals = get_token_bridge_mint_decimals(
        &token_bridge_mint_key,
        &ctx.accounts.marginal_price_pool,
        &ctx.accounts.marginal_price_pool_lp_mint,
    )?;
    msg!("token_bridge_mint_decimals: {:?}", token_bridge_mint_decimals);

    let ten_pow_decimals =
        Decimal::from_u64(10u64.pow(token_bridge_mint_decimals as u32)).ok_or(PropellerError::IntegerOverflow)?;
    let fee_in_token_bridge_mint = fee_in_token_bridge_mint_decimal
        .checked_mul(ten_pow_decimals)
        .and_then(|v| v.to_u64())
        .ok_or(PropellerError::ConversionError)?;

    msg!(
        "fee_in_token_bridge_mint_decimal: {:?} fee_in_token_bridge_mint: {:?}",
        fee_in_token_bridge_mint_decimal,
        fee_in_token_bridge_mint
    );
    res = fee_in_token_bridge_mint;
    Ok(res)
}
