document.addEventListener("DOMContentLoaded", async function () {
    const taskInput = document.getElementById("taskInput");
    const addTaskButton = document.getElementById("addTaskButton");
    const taskList = document.getElementById("taskList");
  
    let tasks = await fetchTasksFromAPI(); // Utilizar fetch para cargar tareas desde una API
  
    function updateTasks() {
      taskList.innerHTML = "";
      tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.textContent = task.task;
        li.classList.add("task-item");
  
        const completeButton = document.createElement("button");
        completeButton.textContent = task.completed ? "Desmarcar" : "Completar";
        completeButton.classList.add("complete-button");
  
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Eliminar";
        deleteButton.classList.add("delete-button");
  
        li.appendChild(completeButton);
        li.appendChild(deleteButton);
        taskList.appendChild(li);
  
        li.addEventListener("click", () => {
          li.classList.toggle("completed");
          task.completed = !task.completed;
          completeButton.textContent = task.completed ? "Desmarcar" : "Completar";
          saveTasksToLocalStorage();
        });
  
        completeButton.addEventListener("click", (event) => {
          event.stopPropagation();
          li.classList.toggle("completed");
          task.completed = !task.completed;
          completeButton.textContent = task.completed ? "Desmarcar" : "Completar";
          saveTasksToLocalStorage();
        });
  
        deleteButton.addEventListener("click", (event) => {
          event.stopPropagation();
          // Agregar SweetAlert para confirmar la eliminación
          swal({
            title: "¿Estás seguro?",
            text: "Esta tarea se eliminará permanentemente.",
            icon: "warning",
            buttons: ["Cancelar", "Eliminar"],
            dangerMode: true,
          }).then((willDelete) => {
            if (willDelete) {
              tasks.splice(index, 1);
              updateTasks();
              saveTasksToLocalStorage();
              swal("Tarea eliminada correctamente.", {
                icon: "success",
              });
            }
          });
        });
  
        deleteButton.addEventListener("click", (event) => {
          event.stopPropagation();
          // Agregar SweetAlert para confirmar la eliminación
          Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta tarea se eliminará permanentemente.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
            cancelButtonText: "Cancelar",
          }).then((result) => {
            if (result.isConfirmed) {
              tasks.splice(index, 1);
              updateTasks();
              saveTasksToLocalStorage();
              Swal.fire("Tarea eliminada correctamente.", {
                icon: "success",
              });
            }
          });
        });
  
        if (task.completed) {
          li.classList.add("completed");
        }
      });
    }
  
    function saveTasksToLocalStorage() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  
    addTaskButton.addEventListener("click", () => {
      const newTask = taskInput.value;
      if (newTask.trim() !== "") {
        tasks.push({ task: newTask, completed: false });
        taskInput.value = "";
        updateTasks();
        saveTasksToLocalStorage();
      }
    });
  
    async function fetchTasksFromAPI() {
      try {
        // Simular una llamada a una API ficticia
        const response = await fetch("https://jsonplaceholder.typicode.com/todos");
        const data = await response.json();
  
        // Mapear los datos de la API a nuestro formato de tarea
        const tasks = data.map((item) => ({
          task: item.title,
          completed: item.completed,
        }));
  
        return tasks;
      } catch (error) {
        console.error("Error al cargar tareas desde la API:", error);
        return [];
      }
    }
  
    updateTasks();
  });