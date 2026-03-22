// 🚨 Trigger Engine (Hybrid Model)

const checkTrigger = ({ rain, aqi, orderDrop, peakHours, social }) => {

  // 🔥 Hybrid conditions
  if (rain > 70 && orderDrop > 30) {
    return { triggered: true, reason: "Heavy rain + order drop" };
  }

  if (aqi > 300 && orderDrop > 25) {
    return { triggered: true, reason: "High pollution + order drop" };
  }

  if (peakHours && orderDrop > 35) {
    return { triggered: true, reason: "Peak hours loss detected" };
  }

  if (social === true && orderDrop > 20) {
    return { triggered: true, reason: "Social disruption detected" };
  }

  if (orderDrop > 50) {
    return { triggered: true, reason: "Severe order drop" };
  }

  return { triggered: false };
};

module.exports = checkTrigger;