function parseDurationToMinutes(input) {
  const timeUnits = {
      minute: 1, minutes: 1, min: 1, mins: 1, m: 1,
      hour: 60, hours: 60, hr: 60, hrs: 60, h: 60,
      day: 1440, days: 1440, d: 1440,
      month: 43200, months: 43200, mo: 43200, mos: 43200, mth: 43200, mths: 43200,
      year: 525600, years: 525600, yr: 525600, yrs: 525600, y: 525600
  };

  const regex = /(\d+)\s*(years?|yrs?|yr|y|months?|mos?|mo|mths?|mth|days?|d|hours?|hrs?|hr|h|minutes?|mins?|min|m)?\b/gi;

  let totalMinutes = 0;
  let match;

  while ((match = regex.exec(input)) !== null) {
      const value = parseInt(match[1], 10);
      let unit = match[2] ? match[2].toLowerCase() : 'm'; // Default to minutes

      // Avoid ambiguity: treat standalone 'm' as minutes
      if (!unit || !timeUnits[unit]) unit = 'm';

      totalMinutes += value * timeUnits[unit];
  }

  return totalMinutes;
}


// On form submission, convert human input to minutes
document.querySelector("form").addEventListener("submit", function (e) {
  const durationInput = document.getElementById("duration-user");
  const rawDuration = durationInput.value;
  const minutes = parseDurationToMinutes(rawDuration);
  const duration = document.getElementById("duration");
  if (minutes > 0) {
    duration.value = minutes; // set the input to numeric minutes
  } else {
    e.preventDefault(); // stop form submission if invalid
    alert("Please enter a valid duration like '2h 30m', '1 day', etc.");
  }
});


document.addEventListener('DOMContentLoaded', function () {
    let activeDesc = null;

    document.querySelectorAll('.task-description').forEach(desc => {
      desc.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevent click from reaching document
        // Close other expanded descriptions
        if (activeDesc && activeDesc !== desc) {
          activeDesc.classList.remove('expanded');
        }

        // Toggle current one
        desc.classList.toggle('expanded');
        activeDesc = desc.classList.contains('expanded') ? desc : null;
      });
    });

    // Click anywhere else to collapse
    document.addEventListener('click', function () {
      if (activeDesc) {
        activeDesc.classList.remove('expanded');
        activeDesc = null;
      }
    });
});
