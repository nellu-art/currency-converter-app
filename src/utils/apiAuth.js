const API_KEY = process.env.API_KEY;
const MAX = process.env.MAX_API_CALLS;

const users = [{
  _id: 1,
  api_key: API_KEY,
  username: 'admin',
  usage: [{ date: "2023-08-31", count: 0 }]
}]

const genAPIKey = () => {
  //create a base-36 string that contains 30 chars in a-z,0-9
  return [...Array(30)]
    .map((e) => ((Math.random() * 36) | 0).toString(36))
    .join('');
};

const createUser = (_username, req) => {
  const today = new Date().toISOString().split('T')[0];
  const user = {
    _id: Date.now(),
    api_key: genAPIKey(),
    username: _username,
    usage: [{ date: today, count: 0 }],
  };

  console.log('add user');
  users.push(user);
  return user;
};

export const authenticateKey = (req, res, next) => {
  const api_key = req.header("x-api-key");

  if (!api_key) {
    return res.status(401).send({
      error: {
        code: 401,
        message: "No API key found in request.",
      }
    })
  }

  const account = users.find((user) => user.api_key === api_key);
  // find() returns an object or undefined
  if (account) {
    //If API key matches
    //check the number of times the API has been used in a particular day
    const today = new Date().toISOString().split("T")[0];

    const usageCount = account.usage.findIndex((day) => day.date === today);

    if (usageCount >= 0) {
      //If API is already used today
      if (account.usage[usageCount].count >= MAX) {
        //stop if the usage exceeds max API calls
        res.status(429).send({
          error: {
            code: 429,
            message: "Max API calls exceeded.",
          },
        });
      } else {
        //have not hit todays max usage
        account.usage[usageCount].count++;
        console.log("Good API call", account.usage[usageCount]);
        next();
      }
    } else {
      //Push todays's date and count: 1 if there is a past date
      account.usage.push({ date: today, count: 1 });
      //ok to use again
      next();
    }
  } else {
    //Reject request if API key doesn't match
    res.status(403).send({ error: { code: 403, message: "You not allowed." } });
  }
};