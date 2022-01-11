# Avoiding Common Attacks

### Security
1. Usage of Require and Revert - To ensure proper ownership, require and revert are used to guarantee correct authorization when sending transactions.
2. Pull over Push - Only makes contract calls on mint or buy functions, remaining are view functions only.
3. Proper use of .call and .delegateCall SWC-104 - Proper use of call is used on all data extraction functions.
4. Irrelevant code SWC-135 - There is no code with unintended side effects