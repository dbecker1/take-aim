import StandardConfigure from "./standard/StandardConfigure";
import StandardShoot from "./standard/StandardShoot";
import DuelingConfigure from "./duelingTree/DuelingConfigure";
import DuelingShoot from "./duelingTree/DuelingShoot";
import MovingConfigure from "./moving/MovingConfigure";
import MovingShoot from "./moving/MovingShoot"


const standard = {
    name: "Standard Target Shooting",
    description: "Stationary targets with the option to provide a fixed distance",
    configureComponent: StandardConfigure,
    shootComponent: StandardShoot
}

const duelingTree = {
    name: "Dueling Tree",
    description: "Compete with a friend or shoot at steel plates solo!",
    configureComponent: DuelingConfigure,
    shootComponent: DuelingShoot
}

const moving = {
    name: "Moving Targets",
    description: "Shoot bullseye targets moving across the screen!",
    configureComponent: MovingConfigure,
    shootComponent: MovingShoot
}

const comingSoon = {
    name: "Coming Soon!",
    description: "Probably something really cool.",
    configureComponent: null,
    shootComponent: null
}

export const shootingModes = [standard, duelingTree, moving, comingSoon]