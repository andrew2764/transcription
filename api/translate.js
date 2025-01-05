// api/translate.js
export default async function handler(req, res) {
  const testEnvionmentVariable = process.env.TEST_ENVIRONMENT_VARIABLE;
  const text = '123'
  res.status(200).json({ text, testEnvionmentVariable });
  return;
}
