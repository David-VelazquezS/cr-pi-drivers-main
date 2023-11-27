const { Router } = require("express");
const axios = require("axios");
const { route } = require("../server");

const router = Router();

router.get('/drivers', async (req, res) => {
    try {
      const apiResponse = await axios.get('../api/db.json');
      const drivers = apiResponse.data;
  
      // Map para dar seguimiento de q solo haya un driver con el mismo nombre y apellido
      const uniqueDrivers = new Map();
  
      drivers.forEach((driver) => {
        // 'llave' basada en combinación de nombre y apellido
        const identifier = `${driver.name.forename}-${driver.name.surname}`;
  
        // Solo si no esta en el Map, incluir al driver
        if (!uniqueDrivers.has(identifier)) {
          uniqueDrivers.set(identifier, {
            id: driver.id,
            nombre: driver.name.forename,
            apellido: driver.name.surname,
            descripcion: driver.description,
            imagen: driver.image.url || "https://thumbs.dreamstime.com/b/professional-f-driver-captured-standing-starting-line-preparing-adrenaline-filled-race-f-driver-standing-up-277749883.jpg",
            nacionalidad: driver.nationality,
            dob: driver.dob,
          });
        }
      });
  
      // respuesta de la petición
      res.json([...uniqueDrivers.values()]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });


module.exports = router;