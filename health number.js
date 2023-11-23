system.runInterval(() => {
    for (const player of world.getPlayers()) {
      if (!player.hasTag("dbe:scouter")) continue;
  
      const filter = {
        location: player.location,
        minDistance: 1,
        maxDistance: 32,
        excludeFamilies: ["inanimate"],
      };
  
      try {
        for (const entity of world
          .getDimension(player.dimension.id)
          .getEntities(filter)) {
          if (entity.typeId.startsWith("minecraft:") || entity.typeId === "player") {
            var h=entity.getComponent("minecraft:health");
            if(h==undefined) continue;
            const healthComponent = h.currentValue;
            const healthString = `${Math.round(
              healthComponent
            )} / ${Math.round(h.effectiveMax)}`;
            const lv_mob = getScore(entity,`level_mob`)
            entity.nameTag = `[`+lv_mob+entity.typeId.replace(`minecraft:`,"]") + healthString;
          }
        }
      } catch (error) {
      }
    }
  }, 0.25);
