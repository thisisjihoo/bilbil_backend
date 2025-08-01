import {
    CreatePostService,
    DeletePostService,
    GetPostService,
    GetPostsService,
    UpdatePostService
} from "./post.service.js";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function CreatePostController(req, res) {
    try {
        const response = await CreatePostService(req, res);
        res.send(escapeHtml(response));
    } catch (error) {
        res.status(500).send('An error occurred');
    }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function GetPostsController(req, res) {
    try {
        const response = await GetPostsService(req, res);
        res.send(escapeHtml(response));
    } catch (error) {
        res.status(500).send('An error occurred');
    }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function GetPostController(req, res) {
    try {
        const response = await GetPostService(req, res);
        res.send(escapeHtml(response));
    } catch (error) {
        res.status(500).send('An error occurred');
    }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function UpdatePostController(req, res) {
    try {
        const response = await UpdatePostService(req, res);
        res.send(escapeHtml(response));
    } catch (error) {
        res.status(500).send('An error occurred');
    }
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @return {Promise<void>}
 */
export async function DeletePostController(req, res) {
    try {
        const response = await DeletePostService(req, res);
        res.send(escapeHtml(response));
    } catch (error) {
        res.status(500).send('An error occurred');
    }
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
