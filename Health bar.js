const overworld = world.getDimension("overworld")

function closestMods(location) {
    const options = {
        location: location,
        maxDistance: 8,
        minDistance: 0.5,
    };

    const entities = overworld.getEntities(options);

    return entities.filter(entity => {
        if (entity instanceof Player) {
            return false;
        }
        return entity.hasComponent("health");
    });
}

system.runInterval(() => {
    const players = world.getAllPlayers();
    if (players.length === 0) {
        return;
    }

    players.forEach((player) => {
        const closestEntities = closestMods(player.location);
        if (closestEntities.length === 0) {
            return;
        }

        closestEntities.forEach((entity) => {
            if (entity.typeId == "minecraft:armor_stand") return
            if (entity.typeId == "minecraft:bat") return
            const comp = entity.getComponent("health");
            let name = entity.nameTag ? entity.nameTag.trimEnd() : entity.typeId.replace("minecraft:", "");

            const typeIdLength = entity.typeId.replace("minecraft:", "").length;
            let typeIdFormatted = `${name.substr(0, typeIdLength)}`;

            const filledBars = "§2|§r".repeat(comp.currentValue);
            const emptyBars = "§4|§r".repeat(comp.effectiveMax - comp.currentValue);
            entity.nameTag = `${name.length <= typeIdLength ? name : typeIdFormatted}[${getScore(entity,`level_mob`)}]\n[§c${filledBars + emptyBars}§r]`;
        });
    });
});
