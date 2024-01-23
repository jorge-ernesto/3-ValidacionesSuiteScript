// Notas del archivo:
// - Secuencia de comando:
//      - Biomont UE Articulos (customscript_bio_ue_articulos)
// - Registro:
//      - Artículo de inventario con número de lote (lotnumberedinventoryitem)
//      - Ensamblaje/Lista de materiales con lote numerado (lotnumberedassemblyitem)

/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N'],

    function (N) {

        const { search } = N;

        /******************/

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        function beforeSubmit(context) {
            log.debug('Punto de Entrada', 'beforeSubmit');
            log.debug('context', context);
            log.debug('context.UserEventType', context.UserEventType);
            log.debug('search.Type', search.Type);

            if (context.type === 'edit' || context.type === 'create') {
                // Hacer algo
                log.debug('', 'Entro al modo Crear o Editar')

                // Viejo registro
                    var articulo = context.oldRecord
                    var internalid = articulo.getValue('internalid');
                    var itemid = articulo.getValue('itemid');
                    var displayname = articulo.getValue('displayname');

                    var data = {
                        'internalid': internalid,
                        'itemid': itemid,
                        'displayname': displayname,
                    }
                    log.debug('articulo old', data)

                // Nuevo registro
                    var articulo = context.newRecord
                    var internalid = articulo.getValue('internalid');
                    var itemid = articulo.getValue('itemid');
                    var displayname = articulo.getValue('displayname');

                    var data = {
                        'internalid': internalid,
                        'itemid': itemid,
                        'displayname': displayname,
                    }
                    log.debug('articulo', data)

                // Buscar registro
                    // Crear una búsqueda para obtener los registros
                    var searchObj = search.create({
                        type: search.Type.ITEM,
                        columns: [],
                        filters: [
                            ['displayname', 'is', data.displayname.trim()],
                            'AND',
                            ['internalid', 'noneof', data.internalid]
                        ]
                    });
                    log.debug('searchObj', searchObj)

                    var codigoExistente = false;

                    // Ejecutar la búsqueda y recorrer los resultados
                    searchObj.run().each((result) => {
                        // Verificar result
                        log.debug('result', result)

                        // Si se encuentra al menos un registro, establece 'codigoExistente' en verdadero y detén la búsqueda
                        codigoExistente = true;

                        // Detener la búsqueda
                        return false;
                    });

                    // Verifica si el código ya existe
                    if (codigoExistente) {
                        throw new Error('La descripción ya existe en un registro existente.');
                    }

                // throw new Error('Detener submit.');
            }
        }

        return { beforeSubmit };

    });
