const apiError = require('./apiError');

module.exports = (promise, paramsFn) => async (req, res) => {
  const boundParams = paramsFn ? paramsFn(req, res) : [];
  try {
    const result = await promise(...boundParams);
    if (result) {
      return res.status(200).json(result);
    } else {
      return res.sendStatus(200);
    }
  }
  catch (err) {
    console.log(err); // TODO: remove
    if (err instanceof apiError) {
      return res.status(err.status).json({ err });
    }
    return res.status(500).json({ err: err.message || err });
  }
};