import { test, expect, Page } from "@playwright/test";
import { GraphQLResponseWithData as RelayGraphQLResponseWithData } from "relay-runtime";
import path from "path";
import { AppQueryResponse } from "./__generated__/AppQuery.graphql";

// Mutable removes the readonly property from a type. This is done because the Relay compiler outputs types with readonly fields.
type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};

// GraphQLResponseWithData is a generic which allows the type of the 'data' field to be modified
interface GraphQLResponseWithData<T> extends Omit<RelayGraphQLResponseWithData, "data"> {
  data: T;
}

// modifyGraphQLResponse provides an easy way to modify the data returned from a GraphQL endpoint
async function modifyGraphQLResponse(
  page: Page,
  url: string,
  mutator: (body: any) => any /* eslint-disable-line @typescript-eslint/no-explicit-any */,
) {
  await page.route(url, async (route) => {
    const response = await page.request.fetch(route.request());
    route.fulfill({
      response,
      body: JSON.stringify(mutator(await response.json())),
    });
  });
}

// This beforeEach hook ensures that the compiled Vite project is served at http://localhost/ for each test.
test.beforeEach(async ({ page }) => {
  await page.route("http://localhost/**", (route) => {
    if (route.request().resourceType() === "document") {
      return route.fulfill({
        status: 200,
        path: path.join(__dirname, "../dist/index.html"),
      });
    } else {
      const url = new URL(route.request().url());
      return route.fulfill({
        status: 200,
        path: path.join(__dirname, "../dist", url.pathname),
      });
    }
  });
});

test("renders list with many ships", async ({ page }) => {
  await modifyGraphQLResponse(
    page,
    "https://api.spacex.land/graphql",
    (body: GraphQLResponseWithData<Mutable<AppQueryResponse>>) => {
      body.data.ships = [
        {
          id: "one",
          name: "Ship One",
        },
        {
          id: "two",
          name: "Ship Two",
        },
      ];

      return body;
    },
  );

  await page.goto(`http://localhost`, { waitUntil: "networkidle" });

  // Check title exists and hence that page rendered correctly
  const titleTxt = page.locator("h1");
  await expect(await titleTxt.count()).toBe(1);
  await expect(await titleTxt.textContent()).toBe("SpaceX Data Viewer");

  // Check list of ships rendered correctly
  const shipsList = page.locator("[aria-labelledby=ships-heading]");
  await expect(await shipsList.count()).toBe(1);
  const shipsListChildren = shipsList.locator("li");
  await expect(await shipsListChildren.count()).toBe(2);
  await expect(await shipsListChildren.nth(0).textContent()).toBe("Ship One");
  await expect(await shipsListChildren.nth(1).textContent()).toBe("Ship Two");
});

test("renders list with no ships", async ({ page }) => {
  await modifyGraphQLResponse(
    page,
    "https://api.spacex.land/graphql",
    (body: GraphQLResponseWithData<Mutable<AppQueryResponse>>) => {
      body.data.ships = [];
      return body;
    },
  );

  await page.goto(`http://localhost`, { waitUntil: "networkidle" });

  // Check title exists and hence that page rendered correctly
  const titleTxt = page.locator("h1");
  await expect(await titleTxt.count()).toBe(1);
  await expect(await titleTxt.textContent()).toBe("SpaceX Data Viewer");

  // Check list of ships rendered correctly
  const shipsList = page.locator("[aria-labelledby=ships-heading]");
  await expect(await shipsList.count()).toBe(1);
  const shipsListChildren = shipsList.locator("li");
  await expect(await shipsListChildren.count()).toBe(0);
});
