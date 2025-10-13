/**
 * @author Guilherme Fraga
 * @since 13/09/2025
 * @version 1.0
 */

const vehicles = [
    { description: "Moto", maxWeight: 45, vehicles: [] },
    { description: "Van", maxWeight: 3000, vehicles: [] },
    { description: "Kombi", maxWeight: 5000, vehicles: [] },
    { description: "Caminhão", maxWeight: 12000, vehicles: [] },
];

let items = [];

function controller() {
    getData();
    if (items.length === 0) {
        document.getElementById("result-text").value = "Nenhum item válido para processar.";
        return;
    }
    items.forEach(distributeItemsBetweenVehicles);
    showResult();
    resetArrays();
}

function showResult() {
    let finalResult = "";
    const vehiclesWithItems = vehicles.filter(vehicle => vehicle.vehicles.length > 0);

    let totalCapacity = 0;
    let totalWeight = 0;

    const vehicleResults = vehiclesWithItems.map(vehicle => {
        const weightInVehicle = calculateWeightInVehicle(vehicle);
        totalCapacity += vehicle.maxWeight * vehicle.vehicles.length;
        totalWeight += weightInVehicle;
        return toStringVehicleType(vehicle);
    });

    finalResult += vehicleResults.join('');

    const totalRemainingSpace = totalCapacity - totalWeight;
    const totalPercentageLoaded = (totalWeight / totalCapacity * 100).toFixed(2);

    finalResult += `\nCapacidade total: ${totalCapacity}kg\n`;
    finalResult += `Peso total: ${totalWeight}kg\n`;
    finalResult += `Espaço de sobra: ${totalRemainingSpace}kg\n`;
    finalResult += `Percentual carregado: ${totalPercentageLoaded}%`;

    document.getElementById("result-text").value = finalResult;
}

function resetArrays() {
    vehicles.forEach(vehicle => vehicle.vehicles = []);
    items = [];
}

function toStringVehicleType(vehicle) {
    return vehicle.vehicles.map((unit, index) => {
        return `${vehicle.description} ${index + 1}: \n${unit.map(toString).join('')}`;
    }).join('');
}

function toString(item) {
    return `${item.weight}kg ${item.description}\n`;
}

function getData() {
    const data = document.getElementById("data").value.trim();
    items = data.split('\n').map(line => {
        line = line.trim();

        const match = line.match(/^(\d+)\s*kg\s*(.*)$/i);
        if (!match) return null;

        const weight = parseInt(match[1], 10);
        const description = match[2].trim();
        return { weight, description };
    }).filter(item => item !== null);
}

function clearTextArea() {
    document.getElementById("data").value = "";
    document.getElementById("result-text").value = "";
}

function distributeItemsBetweenVehicles(item) {
    for (let vehicle of vehicles) {
        if (item.weight <= vehicle.maxWeight) {
            distributeItemInVehicle(vehicle, item);
            break;
        }
    }
}

function distributeItemInVehicle(vehicle, item) {
    if (vehicle.vehicles.length === 0) {
        vehicle.vehicles.push([item]);
        return;
    }

    const lastVehicle = vehicle.vehicles[vehicle.vehicles.length - 1];
    const currentWeight = lastVehicle.reduce((sum, it) => sum + it.weight, 0);

    if (currentWeight + item.weight <= vehicle.maxWeight) {
        lastVehicle.push(item);
    } else {
        vehicle.vehicles.push([item]);
    }
}

function calculateWeightInVehicle(vehicle) {
    return vehicle.vehicles.reduce((total, unit) => {
        return total + unit.reduce((sum, item) => sum + item.weight, 0);
    }, 0);
}
