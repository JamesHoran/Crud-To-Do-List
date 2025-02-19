import type { MouseEvent } from "react";

interface TestResponse {
  message: string
}

async function fetchData(): Promise<TestResponse | null> {
  try {
    // const response = await fetch('http://localhost:3001');
    const response = await fetch('http://localhost:3001/more-data');

    if(!response.ok) {
      console.error("error fetching data")
    }

    const json = await response.json();

    if (typeof json === 'object' && json !== null && 'message' in json && typeof json.message === 'string') {
      const data: TestResponse = json as TestResponse;
      return data;
    } else {
      console.error("Invalid JSON response:", json);
      return null;
    }

  } catch (error) {
    console.error(`error fetching data: ${error}`)
    return null
  }
}

const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
  try {
    const data = await fetchData();
    if (data) {
      console.log(data.message);
    } else {
      console.error("Fetch failed");
    }
  } catch (error) {
    console.error("Error in handleClick:", error);
  }
}

export function Welcome() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <p></p>
        <input type="text" id="newTask" className="border"></input>
        <button id="addTask" className="border">Add Task</button>
        <button onClick={handleClick}>Fetch Data</button>
      </div>
    </main>
  );
}
