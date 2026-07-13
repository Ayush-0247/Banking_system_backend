import accountModel from "../models/account.model.js";


async function createAccountController(req, res) {

    const user = req.user;

    const account = await accountModel.create({
        user: user._id
    })

    res.status(201).json({
        account
    })

}

async function getUserAccountsController(req, res) {

    const accounts = await accountModel.find({ user: req.user._id });

    res.status(200).json({
        accounts
    })
}

async function getAccountBalanceController(req, res) {
    const { accountId } = req.params;

    const account = await accountModel.findOne({
        _id: accountId,
        user: req.user._id
    })

    if (!account) {
        return res.status(404).json({
            message: "Account not found"
        })
    }

    const balance = await account.getBalance();

    res.status(200).json({
        accountId: account._id,
        balance: balance
    })
}

async function showallaccountofauser (req, res) {
    const accounts = await accountModel.find({ user: req.user._id });
    res.status(200).json({
        accounts
    })
}


async function deleteaccountofauser(req, res) {
    try {
        const { id } = req.body;

        const account = await accountModel.findById(id);

        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            });
        }

        if (account.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({
        message: "You are not allowed to delete this account"
    });
}

        await account.deleteOne();

        return res.status(200).json({
            message: "Account deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}


export {
    createAccountController,
    getUserAccountsController,
    getAccountBalanceController,
    showallaccountofauser,
    deleteaccountofauser,
};