import StandardConfigure from "./standard/StandardConfigure";
import StandardShoot from "./standard/StandardShoot";


const standard = {
    name: "Standard Target Shooting",
    description: "Stationary targets with the option to provide a fixed distance",
    configureComponent: StandardConfigure,
    shootComponent: StandardShoot
}

const comingSoon = {
    name: "Coming Soon!",
    description: "Probably something really cool.",
    configureComponent: null,
    shootComponent: null
}

export const shootingModes = [standard, comingSoon, comingSoon, comingSoon]