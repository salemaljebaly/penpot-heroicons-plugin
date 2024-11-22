import "./style.css";

// Get the current theme from the URL
const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get("theme") ?? "light";

document.addEventListener("DOMContentLoaded", async () => {
  const searchBox = document.getElementById("search-box") as HTMLInputElement;
  const iconContainer = document.getElementById("icon-container") as HTMLElement;

  // Load all icons on startup
  await loadAllIcons();

  searchBox.addEventListener("input", function () {
    const query = searchBox.value.toLowerCase().trim();
    iconContainer.innerHTML = ""; // Clear previous icons

    if (query.length > 0) {
      fetchIcons(query);
    } else {
      // Load all icons again if the search box is cleared
      loadAllIcons();
    }
  });

  async function loadAllIcons() {
    iconContainer.innerHTML = ""; // Clear the container
    const icons = await fetchIconList("solid");
    displayIcons(icons);
  }

  async function fetchIcons(query: string) {
    const icons = await fetchIconList("solid");
    const matchingIcons = icons.filter((iconName) => iconName.includes(query));
    displayIcons(matchingIcons);
  }

  async function fetchIconList(style: "outline" | "solid"): Promise<string[]> {
    const response = await fetch(`https://api.github.com/repos/tailwindlabs/heroicons/contents/src/24/${style}`);
    const data = await response.json();
    return data.map((item: { name: string }) => item.name);
  }

  function displayIcons(iconList: string[]) {
    const baseUrl = "https://raw.githubusercontent.com/tailwindlabs/heroicons/refs/heads/master/src/24/solid/";

    iconList.forEach((iconName) => {
      const iconElement = document.createElement("div");
      iconElement.classList.add("icon-item");

      fetch(`${baseUrl}${iconName}`)
        .then((response) => response.text())
        .then((svg) => {
          // Modify the SVG color for visibility in UI
          const modifiedSvg = svg.replace(/fill=".*?"/g, 'fill="#777"'); // Changes color to a lighter gray
          iconElement.innerHTML = modifiedSvg;

          iconElement.addEventListener("click", () => {
            // Send the original SVG content to plugin.ts to insert into the canvas
            parent.postMessage(`insert-icon:${svg}`, "*");
          });

          iconContainer.appendChild(iconElement);
        })
        .catch((error) => console.error("Error fetching icon:", error));
    });
  }

  // Listen for theme changes from plugin.ts
  window.addEventListener("message", (event) => {
    if (event.data.source === "penpot") {
      document.body.dataset.theme = event.data.theme;
    }
  });
});