exports.authRes = ({ user, token }) => {
  const res = {};
  if (user) {
    res.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
  }
  if (token) res.token = token;
  return res;
};
