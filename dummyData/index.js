const faker = require('faker');
const axios = require('axios');

const IDEA_GENERATOR_API = 'https://appideagenerator.com/call.php';
const IDEA_API = 'http://localhost:3000';

const randomInt = () => Math.floor(Math.random() * 10);

const generateIdea = async () => {
  const { data } = await axios.get(IDEA_GENERATOR_API);
  return data.replace(/\n/g, '');
};

const generateUser = async () => {
  const { data } = await axios.post(`${IDEA_API}/api/user/register`, {
    username: faker.internet.userName(),
    password: faker.internet.password(8),
  });

  return data.token;
};

const postNewIdea = async token => {
  const idea = await generateIdea();
  await axios.post(
    `${IDEA_API}/api/idea`,
    {
      idea,
      description: faker.lorem.paragraph(),
    },
    {
      headers: { authorization: `Bearer ${token}` },
    },
  );

  return idea;
};

(async () => {
  const randUserNum = randomInt();
  const randIdeaNum = randomInt();

  for (let i = 0; i < randUserNum; i++) {
    const token = await generateUser();
    for (let j = 0; j < randIdeaNum; j++) {
      await postNewIdea(token);
    }
  }
})();
