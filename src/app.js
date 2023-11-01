const express = require('express')
const hbs = require('hbs')
const path = require('path')
const geocode = require('./utils/geocode')
const forecast = require('./utils/prediksiCuaca')
const axios = require('axios')
// console.log(__dirname)
// console.log(__filename)
// console.log(path.join(__dirname, '../public'))

const app = express()
const port = process.env.PORT || 3000
//Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')


//handlebars engine and view location
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialsPath)

//setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index',{
        title: 'Aplikasi Cek Cuaca',
        name: 'Musfara Zahra Nadien'
    })
})

app.get('/tentang', (req, res) => {
    res.render('tentang', {
        title: 'Tentang Saya',
        name: 'Musfara Zahra Nadien'
    })
})

app.get('/bantuan', (req, res) => {
    res.render('bantuan', {
        title: 'Bantuan',
        name: 'Musfara Zahra Nadien'
    })
})

//ini halaman berita
app.get('/berita', async (req, res) => {
    try {
        const urlApiMediaStack = 'http://api.mediastack.com/v1/news';
        const apiKey = '5053f7089257917dd61e589f5d567342';

        const params = {
            access_key: apiKey,
            countries: 'id', 
        };

        const response = await axios.get(urlApiMediaStack, { params });
        const dataBerita = response.data;

        res.render('berita', {
            title: 'News Page',
            name: 'Musfara Zahra Nadien',
            judul: 'Laman Berita',
            berita: dataBerita.data,
        });
    } catch (error) {
        console.error(error);
        res.render('error', {
            judul: 'Terjadi Kesalahan',
            pesanKesalahan: 'Terjadi kesalahan saat mengambil berita.',
        });
    }
});



// app.get('/', (req, res) => {
//     res.send(
//         '<h1>Selamat Datang</h1>'
//     )
// })
// app.get('/bantuan', (req, res) => {
//     res.send([{
//         nama: 'Musfara Zahra Nadien',
//     },{
//         nama: 'Fara'
//     }])
// })
// app.get('/tentang', (req, res) => {
//     res.send('<h1>Halaman Tentang</h1>')
// })
app.get('/infocuaca', (req, res) => {
    if(!req.query.address){
        return res.send({
            error:'Kamu harus memasukan lokasi yang ingin dicari'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error){
            return res.send({error})
        }
        forecast(latitude, longitude, (error, dataPrediksi) => {
            if (error){
                return res.send({error})
            }
            res.send({
                prediksiCuaca: dataPrediksi,
                lokasi: location,
                address: req.query.address
            })
        })
    })
})

// app.get('/products', (req, res) => {
//     if(!req.query.search){
//         return res.send({
//             error:'Kamu harus memasukan kata kunci pencarian'
//         })
//     }
//     console.log(req.query.search)
//     res.send({
//         products: []
//     })
// })

app.get('/bantuan/*', (req, res) => {
    res.render('404',{
        title: '404',
        name: 'Musfara Zahra Nadien',
        pesanError: 'Belum ada artikel bantuan tersedia'
    })
})

app.get('*', (req, res) => {
    res.render('404',{
        title: '404',
        name: 'Musfara Zahra Nadien',
        pesanError: 'Halaman tidak ditemukan'
    })
})

app.listen(port, () => {
    console.log('Server is running on port '+ port)
})