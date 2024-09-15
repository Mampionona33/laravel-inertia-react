<?php

namespace App\Services;

use PhpOffice\PhpSpreadsheet\Cell\DataType;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ExcelExportService
{
    public static function createJournalSheet($journalEntries)
    {
        // Créer une nouvelle instance de Spreadsheet
        $spreadsheet = new Spreadsheet();
        $activeWorksheet = $spreadsheet->getActiveSheet();

        // Créer les en-têtes
        $activeWorksheet->setCellValue('A1', 'Référence');
        $activeWorksheet->setCellValue('B1', 'Libelé');
        $activeWorksheet->setCellValue('C1', 'Montant');
        $activeWorksheet->setCellValue('D1', 'Date');
        $activeWorksheet->setCellValue('E1', 'Type');

        // Remplir les données du journal
        $row = 2;
        foreach ($journalEntries as $entry) {
            $activeWorksheet->setCellValue('A' . $row, $entry['ref'])->getColumnDimension('A')->setAutoSize(true);
            $activeWorksheet->setCellValue('B' . $row, $entry['description'])->getColumnDimension('B')->setAutoSize(true);
            $activeWorksheet->setCellValue('C' . $row, $entry['amount'])->getColumnDimension('C')->setAutoSize(true);
            $activeWorksheet->setCellValue('D' . $row, $entry['date'])->getColumnDimension('D')->setAutoSize(true);
            $activeWorksheet->setCellValue('E' . $row, $entry['type'])->getColumnDimension('E')->setAutoSize(true);
            $row++;
        }
        $plageEncaissance = 'E2:E' . ($row - 1);
        $plageDecaissement = 'E2:E' . ($row - 1);
        $plageCritaries = 'C2:C' . ($row - 1);

        // Ajouter la somme dans la colonne C en tant que formule
        $formula = '=SUMIF(' . $plageEncaissance . ',"encaissement",' . $plageCritaries . ') - SUMIF(' . $plageDecaissement . ',"decaissement",' . $plageCritaries . ')';

        // Utiliser setCellValueExplicit pour indiquer que c'est une formule
        $activeWorksheet->setCellValueExplicit('C' . $row, $formula, DataType::TYPE_FORMULA);

        // Retourner l'objet Spreadsheet
        return $spreadsheet;
    }

    public static function download(Spreadsheet $spreadsheet, $filename)
    {
        // Créer un objet Writer pour générer le fichier Excel
        $writer = new Xlsx($spreadsheet);

        // Définir les en-têtes pour le téléchargement du fichier
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="' . $filename . '"');
        header('Cache-Control: max-age=0');

        // Envoyer le fichier à la sortie
        $writer->save('php://output');
    }
}
