import { Request, Response } from "express";
import { query } from "../db/postgres/postgres";

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Get a list of todos
 *     parameters:
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *         description: Number of items to skip
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items to retrieve
 *     responses:
 *       200:
 *         description: A list of todos
 *       400:
 *         description: An error occurred
 */
export const GetTodoList = async (req: Request, res: Response) => {
  try {
    const queryParams = req.query;
    const offset = Number(queryParams?.offset) || 0;
    const limit = Number(queryParams?.limit) || 10;
    const totalData = await query("SELECT COUNT(id) FROM todos");
    const [{ count }] = totalData?.rows;
    const response = await query("SELECT * FROM todos OFFSET $1 LIMIT $2", [
      offset,
      limit,
    ]);

    const bodyResponse = {
      Query: {
        offset,
        limit,
        Total: Number(count) || 0,
      },
      Data: response?.rows || [],
    };
    console.log("GetTodoList executed successfully");
    res.status(200).json(bodyResponse);
  } catch (error) {
    console.log("GetTodoList cannot be executed", error);
    res.status(400).json({ message: "An error occurred" });
  }
};

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Create a new todo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               is_completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Todo created successfully
 *       400:
 *         description: Failed to save the todo
 */
export const StoreTodo = async (req: Request, res: Response) => {
  try {
    const { title, description, is_completed } = req.body;

    const queryString = `INSERT INTO todos (title, description, is_completed) 
        VALUES ($1, $2, $3) RETURNING *`;

    const values = [title, description, is_completed || false];
    const response: any = await query(queryString, values);

    if (response?.rowCount > 0) {
      console.log("StoreTodo executed successfully");
      return res
        .status(200)
        .json({ message: "Todo saved successfully", data: response.rows[0] });
    } else {
      console.log("StoreTodo failed to save data");
      return res.status(400).json({ error: "Failed to save the todo" });
    }
  } catch (error) {
    console.log("StoreTodo cannot be executed", error);
    return res.status(400).json({ error: "Internal Server Error" });
  }
};

/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: Get a todo by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the todo
 *     responses:
 *       200:
 *         description: A single todo
 *       404:
 *         description: Todo not found
 */
export const GetTodoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await query(`SELECT * FROM todos WHERE id = $1`, [id]);

    if (response.rows.length === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    console.log("GetTodoById executed successfully");
    return res.status(200).json({ data: response?.rows[0] });
  } catch (error) {
    console.log("GetTodoById cannot be executed", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Update a todo by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the todo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               is_completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Todo updated successfully
 *       404:
 *         description: Todo not found
 */
export const UpdateTodoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, is_completed } = req.body;

    const queryText = `
        UPDATE todos 
        SET 
            title = $1,
            description = $2,
            is_completed = $3,
            updated_at = NOW()
        WHERE id = $4
        RETURNING *;
    `;

    const values = [title, description, is_completed, id];
    const response = await query(queryText, values);

    if (response.rows.length === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    console.log("UpdateTodoById executed successfully");
    return res
      .status(200)
      .json({ message: "Todo updated successfully", data: response.rows[0] });
  } catch (error) {
    console.error("Error updating todo:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Delete a todo by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the todo
 *     responses:
 *       200:
 *         description: Todo deleted successfully
 *       404:
 *         description: Todo not found
 */
export const DeleteTodoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const queryText = `DELETE FROM todos WHERE id = $1 RETURNING *`;
    const response = await query(queryText, [id]);

    if (response.rows.length === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }

    console.log("DeleteTodoById executed successfully");
    return res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
