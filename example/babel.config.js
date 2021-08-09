module.exports = (api) => {
  const isTest = api.env("test");

  if (!isTest) return {};

  return {
    presets: ["@babel/preset-env", "@babel/preset-typescript", "@babel/preset-react"],
    plugins: ["@babel/plugin-transform-runtime", "relay"],
  };
};
