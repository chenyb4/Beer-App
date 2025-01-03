const roleService = require('../services/RoleService');
const paginationService = require("../services/PaginationService");
const logger = require("../logger");

exports.getRole = async (req, res) => {
    const {id} = req.query;
    try {
        let roles
        if (id) {
            roles = await roleService.getRole(id);

        } else {
            const {returnedRoles, total} = await roleService.getRoles(req);
            roles = await paginationService.addPaginationProperties(returnedRoles, total, req);
        }
        res.status(200).json(roles);
    } catch (err) {
        logger.error(err);
        res.status(500).json({message: 'Service error'});
    }
};

exports.createRole = async (req, res) => {
    const {name, discount} = req.body;

    try {
        const newRole = await roleService.createRole(name, discount);
        res.status(201).json(newRole);
    } catch (err) {
        logger.error(err);
        res.status(400).json({message: 'Bad request'});
    }
};

exports.updateRole = async (req, res) => {
    const {id} = req.query;
    const {name, discount} = req.body;

    try {
        const updatedRole = await roleService.updateRole(id, name, discount);
        if (!updatedRole) {
            return res.status(404).json({message: 'Role not found'});
        }
        res.status(200).json(updatedRole);
    } catch (err) {
        logger.error(err);
        res.status(400).json({message: 'Bad request'});
    }
};

exports.deleteRole = async (req, res) => {
    const {id} = req.query;

    try {
        const deletedRole = await roleService.deleteRole(id);
        res.status(200).json(deletedRole);
    } catch (err) {
        logger.error(err);
        res.status(400).json({message: 'Bad request'});
    }
}
