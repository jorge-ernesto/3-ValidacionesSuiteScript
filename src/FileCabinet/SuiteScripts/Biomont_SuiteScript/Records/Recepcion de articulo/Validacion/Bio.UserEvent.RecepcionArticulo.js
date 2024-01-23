// Notas del archivo:
// - Secuencia de comando:
//      - Biomont UE Recepcion de articulo (customscript_bio_ue_recepcion_articulo)
// - Registro:
//      - Recepción de artículo (itemreceipt)

/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define([],

    function () {

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        function beforeSubmit(context) {

            log.debug('Punto de entrada', 'beforeSubmit');
            log.debug('context', context);
            log.debug('context.UserEventType', context.UserEventType);

            if (context.type === 'create') { // if (context.type === 'edit' || context.type === 'create') {

                // Debug
                log.debug('Modo', 'Modo crear')

                // Obtener el newRecord
                let recepcionArticulo = context.newRecord

                // Obtener datos
                let tipoOperacion = recepcionArticulo.getValue('custbody_ns_pe_oper_type');
                let codigoAduana = recepcionArticulo.getValue('custbodybio_cam_codigo_aduana_dam');
                let regimen = recepcionArticulo.getValue('custbodybio_cam_regimen_dam');
                let numero = recepcionArticulo.getValue('custbodybio_cam_numero_dam');
                let fechaNumeracion = recepcionArticulo.getValue('custbodybio_cam_fecha_numeracion_dam');
                // let anio = recepcionArticulo.getValue('custbodybio_cam_anio_dam');

                // Debug
                let data = {
                    'tipoOperacion': tipoOperacion,
                    'codigoAduana': codigoAduana,
                    'regimen': regimen,
                    'numero': numero,
                    'fechaNumeracion': fechaNumeracion,
                    // 'anio': anio,
                };
                log.debug('data', data);

                // Validacion
                if (tipoOperacion == 18) { // Es Importación
                    if (data.codigoAduana.trim() == '' || data.regimen.trim() == '' || data.numero.trim() == '' || data.fechaNumeracion == '') { // data.anio.trim() == ''
                        throw new Error('Campos DAM vacios.');
                    }
                }

                // Lista de articulos
                let sublistName = 'item';
                let lineCount = recepcionArticulo.getLineCount({ sublistId: sublistName });
                let sublist = recepcionArticulo.getSublist({ sublistId: sublistName });

                // Debug
                // log.debug('lineCount', lineCount)
                // log.debug('sublist', sublist)

                // Validacion
                for (let i = 0; i < lineCount; i++) {
                    log.debug('i', i);

                    let columnItemreceive = recepcionArticulo.getSublistValue({
                        sublistId: sublistName,
                        fieldId: 'itemreceive',
                        line: i
                    });
                    let columnSerie = recepcionArticulo.getSublistValue({
                        sublistId: sublistName,
                        fieldId: 'custcolbio_cam_serie_dam',
                        line: i
                    });
                    let columnSubPartida = recepcionArticulo.getSublistValue({
                        sublistId: sublistName,
                        fieldId: 'custcolbio_cam_subpartida_aran_dam',
                        line: i
                    });
                    log.debug('columnItemreceive', columnItemreceive)
                    log.debug('type of columnItemreceive', typeof (columnItemreceive))
                    log.debug('columnSerie', columnSerie)
                    log.debug('columnSubPartida', columnSubPartida)

                    if (tipoOperacion == 18) { // Es Importación
                        if (columnItemreceive == true) {
                            if (columnSerie.trim() == '' || columnSubPartida.trim() == '') {
                                throw new Error('Campos DAM vacios en lista de articulos.');
                            }
                        }
                    }
                }
            }
        }

        return { beforeSubmit };

    });
