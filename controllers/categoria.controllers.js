const Categoria  = require('../models/Categoria.js');

const getCategoria = async (req, res)=>{
    const {id} = req.params;
    const categoria = await Categoria.findById(id);
    if (!categoria) {
        return res.status(404).json({
            msg: `No se encontro la categoria con el id ${id}`
        });
    }
    else if (categoria.estado == {estado: false}){
        res.json({
            msg: `No existe la categoria con el id ${id}`
        })
    }
return res.status(200).json(categoria);
}

const getCategorias = async(req, res)=>{
    const { hasta, desde } = req.query;
    const query = { estado: true };

    const [ total, categorias ] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip( Number( desde ) )
            .limit(Number( hasta ))
    ]);

    res.json({
        total,
        categorias
    });
}
const postCategoria = async(req, res ) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if ( categoriaDB ) {
        return res.status(400).json({
            msg: `La categoria ${ categoriaDB.nombre }, ya existe`
        });
    }
   /*  console.log("usuario:",usuario); */
    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    
    const categoria = new Categoria( data );

    // Guardar DB
    await categoria.save();

    res.status(201).json(categoria);

}

const deleteCategoria = async (req, res)=>{
    const {id} = req.params
    const categoria = await Categoria.findByIdAndUpdate( id, { estado: false } );
    return res.status(200).json({categoria,
        msg : 'Categoria eliminada correctamente'
    });
}
const updateCategoria = async(req, res)=>{
    const {id} = req.params;
    const nombre = req.body.nombre.toUpperCase();
    const categoria = await Categoria.findByIdAndUpdate(id, {nombre},{ new: true });
    return res.status(200).json({categoria,
        msg : 'Categoria actualizada correctamente'
    });
}

module.exports = {
    getCategoria,
    getCategorias,
    postCategoria,
    deleteCategoria,
    updateCategoria
}