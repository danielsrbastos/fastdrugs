module.exports = (err, req, res, next) => {

  console.log(err)

  if(err.name == 'MulterError' || err.name == 'imagemUpload'){
    return res.status(400).json({
      error: err.name,
      mensagem: err.message
    })
  }

  if (err.statusCode)
    return res.status(err.statusCode).json({'ops': 'aguarde...'})

  res.status(500).json({'ops': 'aguarde...'})
}