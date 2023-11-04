const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { config } = require("../config/sqlserver")

/* GET users listing. */
router.get('/', async (req, res, next) => {
  let data = []

  try{
    await sql.connect(config)

    const retornarCosas = await sql.query("SELECT id, descripcion FROM LaTabla")
    data = retornarCosas.recordset
    //await sql.close()

  }catch(err){
    console.log(err)
    data = err
    res.statusCode = 500
  }

  res.send(data)
});

router.post("/", async (req, res, next) =>{
  const cosa = req.body
  let resultado = {}

  try{
    let connection = await sql.connect(config)

    const result = await connection.request()
                                    .input("id", sql.Int, cosa.id)
                                    .input("descripcion", sql.VarChar, cosa.descripcion)
                                    .query("INSERT INTO LaTabla(id, descripcion) VALUES (@id, @descripcion)")
    resultado = result.rowsAffected
    //await connection.close()

  }catch(err){
    console.error(err)
    res.statusCode = 500
    resultado = err
  }

  res.send(resultado)
})

router.get('/:id', async (req, res, next) => {
  let data = []

  try{
    const connection = await sql.connect(config)

    const retornarCosas = await connection.request().input("id", sql.Int, req.params.id).query("SELECT id, descripcion FROM LaTabla WHERE id = @id")

    data = retornarCosas.recordset
    //await sql.close()

  }catch(err){
    console.log(err)
    data = err
    res.statusCode = 500
  }

  res.send(data)
});

router.put('/:id', async (req, res, next) => {
  let data = []
  let {descripcion} = req.body

  try{
    const connection = await sql.connect(config)

    const retornarCosas = await connection.request().input("id", sql.Int, req.params.id).query("SELECT id, descripcion FROM LaTabla WHERE id = @id")

    if(retornarCosas.recordset.length > 0){
      const result = await connection.request()
                                    .input("id", sql.Int, req.params.id)
                                    .input("descripcion", sql.VarChar, descripcion)
                                    .query("UPDATE LaTabla SET descripcion = @descripcion WHERE id = @id")
      data = retornarCosas.recordset
    }

    //await sql.close()

  }catch(err){
    console.log(err)
    data = err
    res.statusCode = 500
  }

  res.send(data)
});

router.delete('/:id', async (req, res, next) => {
  let data = {}

  try{
    const connection = await sql.connect(config)

    const retornarCosas = await connection.request().input("id", sql.Int, req.params.id).query("SELECT id, descripcion FROM LaTabla WHERE id = @id")

    if(retornarCosas.recordset.length > 0){
      const result = await connection.request()
                                    .input("id", sql.Int, req.params.id)
                                    .query("DELETE FROM LaTabla WHERE id = @id")
      data = retornarCosas.recordset
    }

    //await sql.close()

  }catch(err){
    console.log(err)
    data = err
    res.statusCode = 500
  }

  res.send(data)
});
module.exports = router;
