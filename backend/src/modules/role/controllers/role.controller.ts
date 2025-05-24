// controllers/role.controller.ts
import { Request, Response } from 'express';
import { roleService } from '../services/role.service';
import { RoleDTO } from '../models/role.model';

export class RoleController {
  /**
   * Creates a new role
   */
  async createRole(req: Request, res: Response) {
    try {
      const roleDto: RoleDTO = req.body;

      if (!roleDto.name || roleDto.name.trim() === '') {
        return res.status(400).json({ error: 'Role name is required.' });
      }

      const newRole = await roleService.createRole(roleDto);

      res.status(201).json({
        message: 'Role created successfully.',
        role: newRole,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error creating role:', err.message);
      
      if (err.message === 'Role name already exists') {
        return res.status(400).json({ error: 'Role name already exists.' });
      }
      
      if (err.message.includes('Invalid status')) {
        return res.status(400).json({ error: err.message });
      }
      
      res.status(500).json({ error: err.message || 'Error creating role.' });
    }
  }

  /**
   * Updates an existing role
   */
  async updateRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const roleDto: Partial<RoleDTO> = req.body;

      const updatedRole = await roleService.updateRole(id, roleDto);

      res.status(200).json({
        message: 'Role updated successfully.',
        role: updatedRole,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error updating role:', err.message);
      
      if (err.message === 'Role not found') {
        return res.status(404).json({ error: err.message });
      }
      
      if (err.message === 'Role name already exists') {
        return res.status(400).json({ error: 'Role name already exists.' });
      }
      
      if (err.message.includes('Invalid status')) {
        return res.status(400).json({ error: err.message });
      }
      
      res.status(500).json({ error: err.message || 'Error updating role.' });
    }
  }

  /**
   * Gets all roles with pagination
   */
  async getRoles(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await roleService.getRoles(page, limit);

      res.status(200).json(result);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching roles:', err.message);
      res.status(500).json({ error: 'Error fetching roles.' });
    }
  }

  /**
   * Gets a role by ID
   */
  async getRoleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const role = await roleService.getRoleById(id);

      res.status(200).json(role);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching role:', err.message);
      
      if (err.message === 'Role not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error fetching role.' });
    }
  }

  /**
   * Gets a role by code
   */
  async getRoleByCode(req: Request, res: Response) {
    try {
      const { code } = req.params;
      const role = await roleService.getRoleByCode(code);

      res.status(200).json(role);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching role by code:', err.message);
      
      if (err.message === 'Role not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error fetching role by code.' });
    }
  }

  /**
   * Gets a role with full relations
   */
  async getRoleWithRelations(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const role = await roleService.getRoleWithRelations(id);

      res.status(200).json(role);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching role with relations:', err.message);
      
      if (err.message === 'Role not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error fetching role with relations.' });
    }
  }

  /**
   * Searches roles with filters
   */
  async searchRoles(req: Request, res: Response) {
    try {
      const { name, status } = req.query;

      const searchParams: any = {};
      if (name) searchParams.name = name as string;
      if (status) searchParams.status = status as string;

      const roles = await roleService.searchRoles(searchParams);

      res.status(200).json(roles);
    } catch (error) {
      const err = error as Error;
      console.error('Error searching roles:', err.message);
      res.status(500).json({ error: 'Error searching roles.' });
    }
  }

  /**
   * Gets roles by status
   */
  async getRolesByStatus(req: Request, res: Response) {
    try {
      const { status } = req.params;
      const roles = await roleService.getRolesByStatus(status);

      res.status(200).json(roles);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching roles by status:', err.message);
      res.status(500).json({ error: err.message || 'Error fetching roles by status.' });
    }
  }

  /**
   * Gets next role code
   */
  async getNextCode(req: Request, res: Response) {
    try {
      const nextCode = await roleService.getNextCode();

      res.status(200).json({ nextCode });
    } catch (error) {
      const err = error as Error;
      console.error('Error generating next code:', err.message);
      res.status(500).json({ error: 'Error generating next code.' });
    }
  }

  /**
   * Gets role statistics
   */
  async getRoleStats(req: Request, res: Response) {
    try {
      const stats = await roleService.getRoleStats();

      res.status(200).json({
        ...stats,
        message: 'Statistics retrieved successfully.',
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching role stats:', err.message);
      res.status(500).json({ error: 'Error fetching role stats.' });
    }
  }

  /**
   * Activates a role
   */
  async activateRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const role = await roleService.activateRole(id);

      res.status(200).json({
        message: 'Role activated successfully.',
        role,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error activating role:', err.message);
      
      if (err.message === 'Role not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error activating role.' });
    }
  }

  /**
   * Deactivates a role
   */
  async deactivateRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const role = await roleService.deactivateRole(id);

      res.status(200).json({
        message: 'Role deactivated successfully.',
        role,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error deactivating role:', err.message);
      
      if (err.message === 'Role not found') {
        return res.status(404).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error deactivating role.' });
    }
  }

  /**
   * Deletes a role
   */
  async deleteRole(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await roleService.deleteRole(id);

      res.status(200).json({
        message: 'Role deleted successfully.',
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error deleting role:', err.message);
      
      if (err.message === 'Role not found') {
        return res.status(404).json({ error: err.message });
      }
      
      if (err.message.includes('Cannot delete role')) {
        return res.status(400).json({ error: err.message });
      }
      
      res.status(500).json({ error: 'Error deleting role.' });
    }
  }

  /**
   * Bulk update roles status
   */
  async bulkUpdateRoleStatus(req: Request, res: Response) {
    try {
      const { roleIds, status } = req.body;

      if (!roleIds || !Array.isArray(roleIds) || roleIds.length === 0) {
        return res.status(400).json({ error: 'Role IDs array is required.' });
      }

      if (!status || !['Active', 'Inactive'].includes(status)) {
        return res.status(400).json({ error: 'Valid status (Active/Inactive) is required.' });
      }

      const results = await roleService.bulkUpdateRoleStatus(roleIds, status);

      res.status(200).json({
        message: 'Bulk update completed.',
        results,
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error in bulk update:', err.message);
      res.status(500).json({ error: 'Error in bulk update.' });
    }
  }

  /**
   * Gets active roles for dropdown
   */
  async getActiveRolesForDropdown(req: Request, res: Response) {
    try {
      const roles = await roleService.getActiveRolesForDropdown();

      res.status(200).json(roles);
    } catch (error) {
      const err = error as Error;
      console.error('Error fetching active roles:', err.message);
      res.status(500).json({ error: 'Error fetching active roles.' });
    }
  }
}

// Export singleton instance of the controller
export const roleController = new RoleController();