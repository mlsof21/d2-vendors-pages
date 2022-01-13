module.exports = () => {
  const plugins = [
    'const-enum',
    {
      transform: 'constObject',
    },
  ];

  return {
    plugins,
  };
};
