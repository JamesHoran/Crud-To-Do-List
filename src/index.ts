document.addEventListener('DOMContentLoaded', () => {
  const addButton: HTMLElement | null = document.getElementById("addTask")
  if (addButton) {
      addButton.addEventListener('click', addTask);
  } else {
      console.error("Add button not found");
  }
});

interface Task {
id: number;
name: string;
}

export async function loadTasks(): Promise<void> {
try {
  const response: Response = await fetch('http://localhost:3000/api/getTasks');
  const data: Task[] = await response.json();

  let messageContainer: HTMLElement | null = document.getElementById("tasks");
  if(messageContainer) {
    messageContainer.innerHTML = "";
    data.forEach( (task) => {
      let div: HTMLDivElement = document.createElement("div");
      let buttonDelete: HTMLButtonElement = document.createElement("button");
      let inputEdit: HTMLInputElement = document.createElement("input")
      const icon: HTMLElement = document.createElement("i");
      
      icon.className = "bx bx-trash";
      buttonDelete.onclick = () => deleteTask(task.id);
      inputEdit.value = task.name;
      inputEdit.type = "text";
      inputEdit.id = `editTask${task.id}`
      inputEdit.onblur = () => {
        const taskValue: string = (document.getElementById(`editTask${task.id}`) as HTMLInputElement).value;
        if(taskValue) {
          editTask(task.id, taskValue)
        }
      }
      
      div.appendChild(inputEdit);
      div.appendChild(buttonDelete);
      buttonDelete.appendChild(icon);
      messageContainer.appendChild(div);
    })
  } else {
    console.error("Element with id 'tasks' not found");
  }
} catch (error: any) {
  console.error("Error fetching data:", error);
}
}
loadTasks()

export function addTask(): void {
const taskInput: HTMLInputElement | null = document.getElementById("taskNew") as HTMLInputElement | null;
if(taskInput) {
  const task: string = taskInput.value;
  taskInput.value = "";

  fetch('http://localhost:3000/api/postTask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: task }),
  })
  .then((res: Response) => {
    loadTasks();
    return res.json()
  })
  .then((data: string) => console.log(data))
  .catch((error: any) => console.error(error));
} else {
  console.error("Element with id 'taskNew' not found");
}
}

export function deleteTask(id: number): void {
fetch(`http://localhost:3000/api/deleteTask/${id}`, {
  method: 'DELETE',
})
.then((res: Response) => {
  loadTasks();
  return res.json();
})
.then((data: string) => console.log(data))
.catch((error: any) => console.error(error))
};

export function editTask(id: number, name: string): void {
fetch('http://localhost:3000/api/editTask', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ id: id, name: name }),
})
.then((res: Response) => {
  loadTasks();
  return res.json()
})
.then((data: string) => console.log(data))
.catch((error: any) => console.error(error));
}
