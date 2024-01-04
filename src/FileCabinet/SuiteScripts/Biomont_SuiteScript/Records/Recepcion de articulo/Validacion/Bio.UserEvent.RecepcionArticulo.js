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
            log.debug('Punto de Entrada', 'beforeSubmit');
            log.debug('context', context);
            log.debug('context.UserEventType', context.UserEventType);

            if (context.type === 'create') { // if (context.type === 'edit' || context.type === 'create') {
                // Hacer algo
                log.debug('', 'Entro al modo Crear o Editar')

                // Recepción de artículo
                var recepcionArticulo = context.newRecord

                // DAM de Importación
                var tipoOperacion = recepcionArticulo.getValue('custbody_ns_pe_oper_type');
                var codigoAduana = recepcionArticulo.getValue('custbodybio_cam_codigo_aduana_dam');
                var regimen = recepcionArticulo.getValue('custbodybio_cam_regimen_dam');
                var numero = recepcionArticulo.getValue('custbodybio_cam_numero_dam');
                var fechaNumeracion = recepcionArticulo.getValue('custbodybio_cam_fecha_numeracion_dam');
                // var anio = recepcionArticulo.getValue('custbodybio_cam_anio_dam');

                var data = {
                    'tipoOperacion': tipoOperacion,
                    'codigoAduana': codigoAduana,
                    'regimen': regimen,
                    'numero': numero,
                    'fechaNumeracion': fechaNumeracion,
                    // 'anio': anio,
                }
                log.debug('recepcionArticulo', data)

                // Validacion
                if (tipoOperacion == 18) { // Es Importación
                    if (data.codigoAduana.trim() == '' || data.regimen.trim() == '' || data.numero.trim() == '' || data.fechaNumeracion == '') { // data.anio.trim() == ''
                        throw new Error('Campos DAM vacios.');
                    }
                }

                // Lista de Articulos
                var sublistName = 'item';
                var lineCount = recepcionArticulo.getLineCount({ sublistId: sublistName });
                var sublist = recepcionArticulo.getSublist({ sublistId: sublistName });

                log.debug('lineCount', lineCount)
                log.debug('sublist', sublist)

                // Validacion
                for (var i = 0; i < lineCount; i++) {
                    log.debug('i', i)

                    var columnItemreceive = recepcionArticulo.getSublistValue({
                        sublistId: sublistName,
                        fieldId: 'itemreceive',
                        line: i
                    });
                    var columnSerie = recepcionArticulo.getSublistValue({
                        sublistId: sublistName,
                        fieldId: 'custcolbio_cam_serie_dam',
                        line: i
                    });
                    var columnSubPartida = recepcionArticulo.getSublistValue({
                        sublistId: sublistName,
                        fieldId: 'custcolbio_cam_subpartida_aran_dam',
                        line: i
                    });
                    log.debug('columnItemreceive', columnItemreceive)
                    log.debug('type of columnItemreceive', typeof(columnItemreceive))
                    log.debug('columnSerie', columnSerie)
                    log.debug('columnSubPartida', columnSubPartida)

                    if (tipoOperacion == 18) { // Es Importación
                        if (columnItemreceive == true) {
                            if (columnSerie.trim() == '' || columnSubPartida.trim() == '') {
                                throw new Error('Campos DAM vacios en Lista de Articulos.');
                            }
                        }
                    }
                }
            }
        }

        return { beforeSubmit };

    });
