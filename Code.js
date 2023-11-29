system.runInterval(() => {
    world.getPlayers().forEach((player) => {
        const location = player.location
        const spawnPoints = generateSpawnPoints(location, 20 /*radius*/, 20 /*number of spawns*/)
        spawnPoints.forEach((point) => {
            player.dimension.spawnEntity("zombie", point)
        })
    })
},12000);


function generateSpawnPoints(center, radius, numPoints){
    const spawnPoints = [];

    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * 2 * Math.PI;
        const x = center.x + radius * Math.cos(angle);
        const z = center.z + radius * Math.sin(angle);
        spawnPoints.push({ x, center.y, z });
    }
    return spawnPoints;
}

export function getjob(player) {
    const job = player
      .getTags()
      .map((v) => {
        if (!v.startsWith(JOB_PREFIX)) return null;
        return v.substring(JOB_PREFIX.length);
      })
      .filter((x) => x);
    return job.length == 0 ? [DEFAULT_JOB] : job;
  }

export function metricNumbers(value) {
    const types = ["", "K", "M", "B", "T", "P", "E", "Z", "Y"];
    const selectType = (Math.log10(value) / 3) | 0;
    if (selectType == 0) return value;
    let scaled = value / Math.pow(10, selectType * 3);
    return scaled.valueOf(1) + types[selectType];
}

export function getScore(target, objective) {
    try {
        const score = world.scoreboard.getObjective(objective).getScore(target.scoreboardIdentity);
        return typeof score !== 'undefined' ? score : 0;
    } catch {
        return 0;
    }
  }

import * as server from "@minecraft/server"

const world = server.world

world.beforeEvents.playerBreakBlock.subscribe(result => {
    const block = result.block

    if (block.typeId == "minecraft:oak_log") {
        switch (true) {
            case (block.below(1).typeId == "minecraft:bedrock"):
                placeBlock()
                break;
            case (block.below(2).typeId == "minecraft:bedrock"):
                placeBlock()
                break;
            case (block.below(3).typeId == "minecraft:bedrock"):
                placeBlock()
                break;
            case (block.below(4).typeId == "minecraft:bedrock"):
                placeBlock()
                break;
        }
        function placeBlock() {
            server.system.runTimeout(sleep => {
                result.dimension.fillBlocks(block.location, block.location, "minecraft:oak_log")
            }, 200)
        }
    }
})

async function primaryMenu(player) {
    try {
        const formData = new ChestFormData('large')
            .title('§l§6SHOP')
            .button(10, '§l§bDiamond Helmet', ['', '§r§7Diamond Helmet', 'Click on any item !'], 'minecraft:diamond_helmet')

        const response = await formData.show(player);

        if (!response.canceled) {
            let selectedItem;

            switch (response.selection) {
                case 10:
                    selectedItem = 'minecraft:diamond_helmet';
                    break;
            }

            const itemStack = new ItemStack(selectedItem);
            console.log('Created ItemStack:', itemStack);
            player.dimension.spawnItem(itemStack, player.location);

import { system, world, Player } from "@minecraft/server";

// Clicks Counter
export function getClicks(player) {
    const time = new Date().getTime();
    player["clicks"] || (player["clicks"] = []);

    const clicks = player["clicks"].filter(({ timestamp }) => time - 1000 < timestamp);

    player["clicks"] = clicks;
    return clicks.length;
}

world.afterEvents.entityHitEntity.subscribe(function ({ damagingEntity }) {
    if (damagingEntity instanceof Player) {
        damagingEntity["clicks"] || (damagingEntity["clicks"] = []);
        damagingEntity["clicks"].push({ timestamp: new Date().getTime() });
    }
});

system.runInterval(() => {
    for (const player of world.getPlayers()) {
        
        const clicks = player.hasTag("entity:getranks") ? Math.floor(getClicks(player) / 2) : getClicks(player);

player.onScreenDisplay.setActionBar(`§u§lCps: ${(getClicks(player))}`)
        player.nameTag = `${player.name}\n§uCps: ${clicks}`;

        if (clicks > 14) {
            player.runCommandAsync('effect @s weakness 1 255 true')
            
            player.runCommandAsync(`effect @s mining_fatigue 1 255 true`);
        }

    }
});

let countdown = 10;
let counting = true;

function runCountdown() {
    if (counting) {
        for (let player of world.getPlayers()) {
            if (countdown > 0) {
                player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"§l§bClearing Ground Items In §d${countdown}s"}]}`);
                countdown--;
            } else {
                player.runCommandAsync(`tellraw @s {"rawtext":[{"text":"[§l§6Lag Clear] §bRemoved"},{"text":"§u"},{"score":{"name":"*","objective":"Entites"}},{"text":"§b Entities"}]}`);
                player.runCommandAsync(`kill @e[type=item]`);
                counting = false; 
                setTimeout(() => {
                    countdown = 10; 
                    counting = true; 
                }, 1200); 
            }
        }
    }
}

system.runInterval(runCountdown, 20);

import { world, system } from "@minecraft/server";
import { ActionFormData, MessageFormData, ModalFormData } from "@minecraft/server-ui";

let form = new ActionFormData();
form.title("Action Form");
form.body("This is Action Form Body");
form.button("Button 3", "textures/ui/anit/anit_play.png");

system.run(event => { 
world.beforeEvents.itemUse.subscribe(event => {
	system.run(event => { 
	if (event.itemStack.typeId === "minecraft:stick" && event.itemStack.nameTag === "Form Opener") {
		form.show(event.source).then(r => {
	if (r.canceled) return;

	let response = r.selection;
	switch (response) {
		case 0:
			break;

		case 1:
			break;

		default:
	}
}).catch(e => {
	console.error(e, e.stack);
})
	}
})
})
});




//Detects hotbar slots
function hotbarDetect() {
  system.runInterval(eventTick => {
    for (const player of world.getPlayers()) {
      let hotbarSlot = player.selectedSlot
      player.runCommand(`scoreboard players set @s hotbar ${hotbarSlot + 1}`)
    }
  })
}


//TIME DETECTION
//Hours
function hour() {
  system.runInterval(eventTick => {
	const date = new Date();
	const hournumber = date.getHours();
	const hour = `${hournumber}`;
	 for (const player of world.getPlayers()) {
      player.runCommand(`scoreboard players set @s hour ${hour}`)
	 }
  });
}
//Minutes
function minute() {
  system.runInterval(eventTick => {
	const date = new Date();
	const minnumber = date.getMinutes();
	const minute = `${minnumber}`;
	 for (const player of world.getPlayers()) {
      player.runCommand(`scoreboard players set @s minute ${minute}`)
	 }
  });
}
//Seconds
function second() {
  system.runInterval(eventTick => {
	const date = new Date();
	const secnumber = date.getSeconds();
	const second = `${secnumber}`;
	 for (const player of world.getPlayers()) {
      player.runCommand(`scoreboard players set @s second ${second}`)
	 }
  });
}



hotbarDetect()
hour()
minute()
second()


import {world, Entity, EntityInventoryComponent} from "@minecraft/server";



/**
 *
 * @param {Entity} entity Entity Whose Inventory is to be checked
 * @param {string} item_id item id like 'minecraft:apple'
 *@returns {number} Total amount of specified item that the entity has in its inventory
 */
function GetItemCount(entity, item_id) {
  /**
   *  @type {EntityInventoryComponent|undefined}
   */
  var inventory = entity.getComponent("inventory");
  if (inventory == undefined || !inventory.isValid()) return 0;

  var container = inventory.container;
  if (!container.isValid() || container.size == container.emptySlotsCount)
    return 0;
  var amount = 0;
  for (let index = 0; index < container.size; index++) {
    var itemstack = container.getItem(index);
    if (itemstack != undefined && itemstack.typeId == item_id) {
      amount += itemstack.amount;
    }
  }
  return amount;
}


import { world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
world.afterEvents.playerInteractWithBlock.subscribe(({ block, player }) => {
    if (block.typeId != "minecraft:bedrock") return;
    new ActionFormData()
    .title("Test")
    .body("Hello World!")
    .button("Button")
    .show(player).then((response) => {

    });
});


// Register an event listener for when a player uses an item
world.afterEvents.itemUseOn.subscribe((event) => {
    //get the necessary property
    const player = event.source;
    const item = event.itemStack; //data copy of the actual item
    const block = event.block;
    const useLocation = block.location;
    // Check if the item is a panda:hearthstone
    // And Check the type of the targeted block
    if (item.typeId === "panda:hearthstone" && (block.typeId === "campfire" || block.typeId === "soul_campfire")) {
            // Send a message to the player
            player.sendMessage(`Your location has been saved in the hearthstone.`);
            
            // Store the player's location in the item Lore (made it black)
            item.setLore(["§r§0"+Object.values(useLocation).join("|")])
            
            //send the updated item to the player
            player.getComponent("inventory").container
            .setItem(player.selectedSlot,item)
    }
}
);

world.afterEvents.itemUse.subscribe((event)=>{
    const item = event.itemStack;
    const player = event.source;
    // Check if the item is a panda:hearthstone
    if (item?.typeId !== "panda:hearthstone") return;
    //decode the location
    const xyz = item.getLore()[0].slice(4).split("|").map(e=>Number(e))
    //teleport the player
    player.teleport({
        x: xyz[0],
        y: xyz[1],
        z: xyz[2]
    })
})

import { PlayerSpawnAfterEvent, world } from "@minecraft/server";
import {
  ActionFormData,
  ModalFormData,
  MessageFormData,
} from "@minecraft/server-ui";
import { system } from "@minecraft/server";

system.events.beforeWatchdogTerminate.subscribe((data) => {
  data.cancel = true;
});

world.afterEvents.playerSpawn.subscribe(menu);
/////MENU WARP\\\\\\\

function menu(args) {
  var player = args.player;
  const form = new ActionFormData()
    .title("§l§bMENU PRINCIPAL")
    .body(
      "            --------------------\n             §l§eSERVER NAUTIMC\n§r            --------------------\n\n"
    )
    .button("SERVER WARP")
    .button("give diamante");
  form.show(player).then((result) => {
    if (result.selection === 0) {
      player.runCommandAsync(`playsound random.chestclosed @s`);
    }
    if (result.selection === 1) {
      player.runCommandAsync(`give @s diamond`);
    }
  });
}

world.beforeEvents.itemUse.subscribe((eventData) => {
  let item = eventData.item;
  let player = eventData.source;

  if (item.typeId == "minecraft:compass") {
    console.warn("matched");
    menu(player);
  }
});

world.afterEvents.playerBreakBlock.subscribe((ev) => {
    const player = ev.player;
    const loc = ev.block.location;
    const block = ev.brokenBlockPermutation;
  
    player.dimension.getEntities({location: loc, maxDistance: 2, type: 'minecraft:item'}).forEach(entity => {
        const item = entity.getComponent("item").itemStack;
        if (item.typeId !== block.type.id) return;
    
        const rem = player.getComponent("inventory").container.addItem(item);
        entity.kill();
        
    
        if (rem) {
            player.dimension.spawnItem(rem, loc);
        }
        if (rem) {
            player.sendMessage(`§c"No tienes espacio suficiente en el inventario."`)
        }
    });
  });

class EnchantmentWrapper {
  /**
   *
   * @param {ItemStack} item
   * @returns {ItemEnchantsComponent}
   */
  //Made By NotAPythonEnjoyer#8410
  static getComponent(item) {
    return item.getComponent("minecraft:enchantments");
  }
  /**
   *
   * @param {ItemStack} item
   */
  constructor(item) {
    this.enchants = EnchantmentWrapper.getComponent(item);
    this.enchantments = Array.from(this.enchants.enchantments);
    this.finalEnchants = this.enchants.enchantments;
  }

  hasEnchantment(type)
  {
    try
    {
      
      return this.getEnchantments().find(e => e.typeId == type) ? true : false
    }
    catch {
      return undefined
    }
   
  }

  getEnchantments() {
    try {
      return this.enchantments.map((e) => ({ level: e.level, typeId: e.type.id, maxLevel: e.type.maxLevel }));
    } catch {
      return undefined;
    }
  }

  /**
  Example:
  ------------------------------------
  const item = new ItemStack("minecraft:diamond_sword", 1)
  const enchantWrapper = new EnchantmentWrapper(item)
  enchantWrapper.addEnchantment("sharpness", 4)
  item.getComponent("enchantments").enchantments = enchantWrapper.finalEnchants
  ------------------------------------
  **/
  addEnchantment(type, level) {
    try {
      const enchants = this.finalEnchants;
      enchants.addEnchantment(new Enchantment(type, level));
      this.finalEnchants = enchants;
    } catch (e) {
      console.warn(e + e.stack);
    }
  }
}

function getAllEnchantments(item) {
  try {
    const enchantmentsComponent = item.getComponent("minecraft:enchantments");
    return enchantmentsComponent.enchantments.map(e => ({ level: e.level, typeId: e.type.id, maxLevel: e.type.maxLevel }));
  } catch (error) {
    console.warn("Error fetching enchantments:", error);
    return [];
  }
}

// Example usage:
const item = new ItemStack("minecraft:diamond_sword", 1);
console.warn(getAllEnchantments(item));
