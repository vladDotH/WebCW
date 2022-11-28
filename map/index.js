export * from "./Tile.js";
export * from "./GameMap.js";

/** @param {string} mapFile
 * @return {Promise<[any, any]>} [tiles, objects] */
export async function parseMap(mapFile) {
  const data = await (await fetch(`${mapFile}`)).json();
  return [
    {
      ...data?.layers?.find((e) => e.name === "field"),
      tilewidth: data.tilewidth,
      tileheight: data.tileheight,
    },
    data?.layers?.find((e) => e.name === "objects"),
  ];
}
