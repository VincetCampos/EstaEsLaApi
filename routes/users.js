const express = require('express');
const router = express.Router();
const sql = require('mssql');
const { config } = require("../config/sqlserver")

/* GET users listing. */
router.get('/', async (req, res, next) => {
  let data = []

  try{
    await sql.connect(config)

    const retornarCosas = await sql.query("SELECT Codigo, Nombre, Precio, Existencia FROM Productos")
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
                                    .input("Codigo", sql.Int, cosa.Codigo)
                                    .input("Nombre", sql.VarChar, cosa.Nombre)
                                    .input("Precio", sql.Money, cosa.Precio)
                                    .input("Existencia", sql.Int, cosa.Existencia)
                                    .query("INSERT INTO Productos(Codigo, Nombre, Precio, Existencia) VALUES (@Codigo, @Nombre, @Precio, @Existencia)")
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

    const retornarCosas = await connection.request().input("Codigo", sql.Int, req.params.id).query("SELECT Codigo, Nombre, Precio, Existencia FROM Productos WHERE Codigo = @Codigo")

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
  let {Nombre, Precio, Existencia} = req.body

  try{
    const connection = await sql.connect(config)

    const retornarCosas = await connection.request().input("Codigo", sql.Int, req.params.id).query("SELECT Codigo, Nombre, Precio, Existencia FROM Productos WHERE Codigo = @Codigo")

    if(retornarCosas.recordset.length > 0){
      const result = await connection.request()
                                    .input("Codigo", sql.Int, req.params.id)
                                    .input("Nombre", sql.VarChar, Nombre)
                                    .input("Precio", sql.Money, Precio)
                                    .input("Existencia", sql.Int, Existencia)
                                    .query("UPDATE Productos SET Nombre = @Nombre, Precio = @Precio, Existencia = @Existencia WHERE Codigo = @Codigo")
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

    const retornarCosas = await connection.request().input("Codigo", sql.Int, req.params.id).query("SELECT Codigo, Nombre, Precio, Existencia FROM Productos WHERE Codigo = @Codigo")

    if(retornarCosas.recordset.length > 0){
      const result = await connection.request()
                                    .input("Codigo", sql.Int, req.params.id)
                                    .query("DELETE FROM Productos WHERE Codigo = @Codigo")
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
