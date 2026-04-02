export const handleLoadGameState = async (c, readTextFile, game) => {
  const { state } = c.req.param();
  return await readTextFile(`./data/states/${state}.json`).then((data) => {
    const savedState = JSON.parse(data);
    game.loadGameState(savedState);
    return c.redirect("/");
  }).catch(() => {
    return c.body("Bad Request", 404);
  });
};
