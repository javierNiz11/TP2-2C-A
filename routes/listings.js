const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Función para obtener la colección
const getCollection = () => {
    return mongoose.connection.db.collection('listingsAndReviews');
};

// 1. Endpoint base - Obtener todas las propiedades con paginación
router.get('/', async (req, res) => {
    try {
        const collection = getCollection();
        const pageSize = parseInt(req.query.pageSize) || 50;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * pageSize;

        const listings = await collection
            .find({})
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const total = await collection.countDocuments();

        res.json({
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
            data: listings
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Error obteniendo propiedades' 
        });
    }
});

// 2. Obtener propiedad por ID - VERSIÓN SIMPLE QUE FUNCIONABA
router.get('/:id', async (req, res) => {
    try {
        const collection = getCollection();
        const { id } = req.params;

        // Buscar directamente por el ID como string (sin conversión)
        const listing = await collection.findOne({ _id: id });
        
        if (!listing) {
            return res.status(404).json({ 
                error: 'Propiedad no encontrada' 
            });
        }

        res.json(listing);
    } catch (error) {
        res.status(500).json({ 
            error: 'Error obteniendo propiedad' 
        });
    }
});

// 3. Filtrar propiedades por tipo de alojamiento
router.get('/property-type/:type', async (req, res) => {
    try {
        const collection = getCollection();
        const { type } = req.params;
        const pageSize = parseInt(req.query.pageSize) || 50;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * pageSize;

        const query = { 
            property_type: { $regex: type, $options: 'i' } 
        };

        const listings = await collection
            .find(query)
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const total = await collection.countDocuments(query);

        res.json({
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
            property_type: type,
            data: listings
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Error filtrando propiedades por tipo' 
        });
    }
});

// 4. Propiedades por host específico
router.get('/host/:host_id', async (req, res) => {
    try {
        const collection = getCollection();
        const { host_id } = req.params;
        const pageSize = parseInt(req.query.pageSize) || 50;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * pageSize;

        const query = { 
            'host.host_id': parseInt(host_id) 
        };

        const listings = await collection
            .find(query)
            .skip(skip)
            .limit(pageSize)
            .toArray();

        const total = await collection.countDocuments(query);

        res.json({
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
            host_id: host_id,
            data: listings
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Error obteniendo propiedades del host' 
        });
    }
});

// 5. Propiedades con precio total calculado - VERSIÓN MUY SIMPLE
router.get('/with-total-price', async (req, res) => {
    try {
        const collection = getCollection();
        const pageSize = parseInt(req.query.pageSize) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * pageSize;

        // Consulta MUY simple sin agregaciones complejas
        const listings = await collection
            .find({})
            .skip(skip)
            .limit(pageSize)
            .toArray();

        // Calcular precio total manualmente en JavaScript
        const listingsWithTotal = listings.map(listing => {
            const price = listing.price ? parseFloat(listing.price.toString()) : 0;
            const cleaning_fee = listing.cleaning_fee ? parseFloat(listing.cleaning_fee.toString()) : 0;
            const security_deposit = listing.security_deposit ? parseFloat(listing.security_deposit.toString()) : 0;
            const extra_people = listing.extra_people ? parseFloat(listing.extra_people.toString()) : 0;
            
            return {
                ...listing,
                totalPrice: price + cleaning_fee + security_deposit + extra_people
            };
        });

        const total = await collection.countDocuments();

        res.json({
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
            data: listingsWithTotal
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Error calculando precios totales' 
        });
    }
});

// 6. Ranking de hosts con más propiedades - VERSIÓN SIMPLE
router.get('/top-hosts', async (req, res) => {
    try {
        const collection = getCollection();
        const limit = parseInt(req.query.limit) || 10;

        // Consulta simple sin agregaciones complejas
        const allListings = await collection.find({}).limit(100).toArray();
        
        // Contar manualmente en JavaScript
        const hostCounts = {};
        allListings.forEach(listing => {
            if (listing.host && listing.host.host_id) {
                const hostId = listing.host.host_id;
                if (!hostCounts[hostId]) {
                    hostCounts[hostId] = {
                        host_id: hostId,
                        host_name: listing.host.host_name || 'Unknown',
                        property_count: 0
                    };
                }
                hostCounts[hostId].property_count++;
            }
        });

        const topHosts = Object.values(hostCounts)
            .sort((a, b) => b.property_count - a.property_count)
            .slice(0, limit);

        res.json({
            limit,
            data: topHosts
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Error generando ranking de hosts' 
        });
    }
});

// 7. Actualizar disponibilidad de una propiedad
router.patch('/:id/availability', async (req, res) => {
    try {
        const collection = getCollection();
        const { id } = req.params;
        const { available_30, available_60, available_90, available_365 } = req.body;

        const updateFields = {};
        
        if (available_30 !== undefined) updateFields['availability.available_30'] = available_30;
        if (available_60 !== undefined) updateFields['availability.available_60'] = available_60;
        if (available_90 !== undefined) updateFields['availability.available_90'] = available_90;
        if (available_365 !== undefined) updateFields['availability.available_365'] = available_365;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ 
                error: 'Al menos un campo de disponibilidad debe ser proporcionado' 
            });
        }

        const result = await collection.updateOne(
            { _id: id },
            { $set: updateFields }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ 
                error: 'Propiedad no encontrada' 
            });
        }

        res.json({
            message: 'Disponibilidad actualizada exitosamente',
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        res.status(500).json({ 
            error: 'Error actualizando disponibilidad' 
        });
    }
});

module.exports = router;