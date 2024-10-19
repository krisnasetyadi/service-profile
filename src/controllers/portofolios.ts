import { Request, Response } from "express";
import { initAdmin } from "../db/firebase/initialize";
import { getImageList, uploadFileToFirebase } from "../db/firebase/firebase";
import { query } from "../db/postgres/postgres";
import { stringToArray } from "../utils/helper";

export const GetPortofolioList = async (req: Request, res: Response) => {
  try {
    const queryParams = req.query;
    const offset = Number(queryParams?.offset) || 0;
    const limit = Number(queryParams?.limit) || 0;
    const totalData = await query("SELECT COUNT(id) FROM projects");
    const [{ count }] = totalData?.rows;
    const response = await query("SELECT * FROM projects OFFSET $1 LIMIT $2", [
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
    console.log("GetPortofolioList execute succesfully");
    res.status(200).json(bodyResponse);
  } catch (error) {
    console.log("GetPortofolioList cannot be executed", error);
    res.status(400).json({ message: "An error occured" });
  }
};

export const StorePortofolioList = async (req: Request, res: Response) => {
  try {
    const { name, description, roles, stacks, others, links, is_confidential } =
      req.body;

    const files = req.files as Express.Multer.File[];
    const images = files?.filter((f) => f.fieldname === "images");
    const videos = files?.filter((f) => f.fieldname === "videos");
    let image_urls = [] as string[];

    const existingProject: any = await query(
      `SELECT * FROM projects WHERE name = $1 limit 1`,
      [name]
    );

    if (existingProject.rowCount > 0) {
      return res.status(400).json({ error: "Project already exist" });
    }

    if (images.length > 0) {
      await initAdmin();
      await uploadFileToFirebase(images, name);
      image_urls = await getImageList(name);
    }

    const columns = [
      "name",
      "roles",
      "stacks",
      "others",
      "links",
      "description",
      "is_confidential",
      "image_urls",
      "video_urls",
    ];

    const queryString = `INSERT INTO projects (${columns.join(",")}) 
        VALUES ( ${columns.map((_, i) => `$${i + 1}`).join(",")} )`;

    const values = [
      name,
      stringToArray(roles),
      stringToArray(stacks),
      stringToArray(others),
      stringToArray(links),
      description,
      is_confidential || "N",
      image_urls.length > 0 ? image_urls : null,
      null,
    ];
    const response: any = await query(queryString, values);

    if (response?.rowCount > 0) {
      console.log("StorePortofolioList execute succesfully");
      return res.status(200).json({ message: "Data save successfully" });
    } else {
      console.log(
        "StorePortofolioList cannot be executed while attempting save data"
      );
      return res
        .status(400)
        .json({ error: "An error occurred while attempting to save the data" });
    }
  } catch (error) {
    console.log("StorePortofolioList cannot be executed", error);
    return res.status(400).json({ error: "Internal Server Error" });
  }
};

export const GetPortofolioById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const response = await query(`SELECT * FROM projects where id = ${id}`);

    console.log("GetPortofolioById executed succesfully");
    return res.status(200).json({ Data: response?.rows[0] });
  } catch (error) {
    console.log("GetPortofolioById cannot be executed", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const UpdatePortofolioById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      roles,
      stacks,
      others,
      links,
      description,
      is_confidential,
      video_urls,
      cover_image,
    } = req.body;

    const files = req.files as Express.Multer.File[];
    const images = files?.filter((f) => f.fieldname === "images");
    const videos = files?.filter((f) => f.fieldname === "videos");

    let image_urls = [] as string[];

    if (images.length > 0) {
      await initAdmin();
      await uploadFileToFirebase(images, name);
      image_urls = await getImageList(name);
    }

    const queryText = `
        UPDATE projects 
        SET 
            roles = $1,
            stacks = $2,
            others = $3,
            links = $4,
            description = $5,
            is_confidential = $6,
            image_urls = $7,
            video_urls = $8,
            cover_image = $9,
            updated_at = NOW()
        WHERE id = $10
        RETURNING *;

    `;

    const values = [
      name,
      roles,
      stacks,
      others,
      stringToArray(links),
      description,
      is_confidential,
      image_urls,
      video_urls,
      cover_image,
      id,
    ];

    const response = await query(queryText, values);

    if (response.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json(response.rows[0]);
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
