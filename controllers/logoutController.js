import Users from '../models/Users.js';

const logoutController = async (req, res) => {
    const refreshToken = req?.cookies?.refreshToken;
    if(!refreshToken) return res.sendStatus(204);

    const user = await Users.findOne({ refreshToken }).exec();
    if(!user) {
        res.clearCookie('refreshToken', {httpOnly: true});
        return res.sendStatus(204);
    }

    user.refreshToken = "";
    await user.save();
    res.clearCookie('refreshToken', {httpOnly: true});
    res.status(200).json({"message": "Successfully signed out!"})
}

export default logoutController;