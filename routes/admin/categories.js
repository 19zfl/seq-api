const express = require('express');
const router = express.Router();
const { Category } = require('../../models');
const { Op} = require('sequelize');
const {
    NotFoundError,
    success,
    failure,
} = require('../../utils/response');

/**
 * 查询分类列表
 * GET /admin/categories
 */
router.get("/", async function (req,res) {
    try {
        const query = req.query;

        // 当前是第几页，如果不传，那就是第一页
        const currentPage = Math.abs(Number(query.currentPage)) || 1;

        // 每页显示多少条数，如果不传，那就显示10条
        const pageSize = Math.abs(Number(query.pageSize)) || 10;

        // 计算 offset
        const offset = (currentPage - 1) * pageSize;

        const condition = {
            order: [['id', 'DESC']],
            limit: pageSize,
            offset: offset
        };

        if (query.name) {
            condition.where = {
                name: {
                    [Op.like]: `%${query.name}%`
                }
            }
        }

        const {count, rows} = await Category.findAndCountAll(condition);

        success(res, '查询分类列表成功。', {
            categories: rows,
            pagination: {
                total: count,
                currentPage,
                pageSize
            }
        });
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 查询分类详情
 * GET /admin/categories/:id
 */
router.get('/:id', async function (req, res) {
    try {
        const category = await getCategory(req);
        success(res, '查询分类成功。', { category });
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 创建分类
 * POST /admin/categories
 */
router.post('/', async function (req, res) {
    try {
        // 白名单过滤
        const body = filterBody(req);

        const category = await Category.create(body);

        success(res, '创建分类成功。', { category }, 201);
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 删除分类
 * DELETE /admin/categories/:id
 */
router.delete('/:id', async function (req, res) {
   try {
       const category = await getCategory(req);
       await category.destroy();
       success(res, '删除分类成功。');
   } catch (error) {
       failure(res, error);
   }
});

/**
 * 更新分类
 * PUT /admin/categories/:id
 */
router.put('/:id', async function (req, res) {
    try {
        const category = await getCategory(req);

        // 白名单过滤
        const body = filterBody(req);

        await category.update(body);
        success(res, '更新分类成功。', { category })
    } catch (error) {
        failure(res, error);
    }
});

/**
 * 公共方法：查询当前分类
 */
async function getCategory(req) {
    // 获取分类ID
    const { id } = req.params;
    // 查询当前分类
    const category = Category.findByPk(id);
    // 如果没有查询到，就抛出异常
    if (!category) throw new NotFoundError(`ID:${id}的分类未找到。`);
    return category;
}

/**
 * 公共方法：白名单过滤
 * @param req
 * @returns {{name, rank: (number|*)}}
 */
function filterBody(req) {
    return {
        name: req.body.name,
        rank: req.body.rank
    };
}

module.exports = router;