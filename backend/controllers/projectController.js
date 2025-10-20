const Project = require('../models/project');

module.exports = {
  getAllProjects(req, res) {
    Project.findAll((err, projects) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error listing projects', error: err });
      }
      return res.status(200).json({ success: true, data: projects });
    });
  },
  createProject(req, res) {
    const project = req.body;
    Project.create(project, (err, data) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error creating project', error: err });
      }
      return res.status(201).json({ success: true, message: 'Project created', data });
    });
  },
  updateProject(req, res) {
    const id = req.params.id;
    const project = req.body;
    Project.update(id, project, (err, data) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error updating project', error: err });
      }
      return res.status(200).json({ success: true, message: 'Project updated', data });
    });
  },
  deleteProject(req, res) {
    const id = req.params.id;
    Project.delete(id, (err, data) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error deleting project', error: err });
      }
      return res.status(200).json({ success: true, message: 'Project deleted', data });
    });
  }
};