import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: { flex: 1 },
  logo: { width: 120, height: 40, objectFit: 'contain' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2D3748', marginBottom: 8 },
  subtitle: { fontSize: 10, color: '#718096', marginBottom: 3 },
  table: { display: 'table', width: 'auto', marginTop: 10 },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    borderBottomStyle: 'solid',
    minHeight: 28,
    alignItems: 'center',
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    borderBottomStyle: 'solid',
    backgroundColor: '#F7FAFC',
    minHeight: 28,
    alignItems: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4A6CF7',
    minHeight: 32,
    alignItems: 'center',
  },
  // Column widths (landscape A4 ≈ 782pt usable)
  colTitle:       { width: '20%', paddingLeft: 8, paddingRight: 4 },
  colName:        { width: '15%', paddingLeft: 4, paddingRight: 4 },
  colDesc:        { width: '22%', paddingLeft: 4, paddingRight: 4 },
  colAnode:       { width: '8%',  paddingLeft: 4, paddingRight: 4, textAlign: 'center' },
  colCathode:     { width: '8%',  paddingLeft: 4, paddingRight: 4, textAlign: 'center' },
  colCurrent:     { width: '9%',  paddingLeft: 4, paddingRight: 4, textAlign: 'center' },
  colDuration:    { width: '9%',  paddingLeft: 4, paddingRight: 4, textAlign: 'center' },
  colStatus:      { width: '9%',  paddingLeft: 4, paddingRight: 8, textAlign: 'center' },
  tableCellHeader: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 9 },
  tableCell:       { fontSize: 8.5, color: '#2D3748' },
  tableCellMuted:  { fontSize: 8, color: '#718096' },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#A0AEC0',
  },
});

const StimulationsPdfDocument = ({ stimulations, clinicName, totalStimulations, isFiltered, filterTerm }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  const logo = "https://www.platoscience.com/cdn/shop/files/LogoMedicalSketches-02_360x.png";

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Stimulations Report</Text>
            <Text style={styles.subtitle}>Clinic: {clinicName}</Text>
            <Text style={styles.subtitle}>Generated: {currentDate}</Text>
            <Text style={styles.subtitle}>Total: {totalStimulations} stimulation(s)</Text>
            {isFiltered && (
              <Text style={styles.subtitle}>Filter: "{filterTerm}"</Text>
            )}
          </View>
          <Image style={styles.logo} src={logo} />
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Header Row */}
          <View style={styles.tableHeader}>
            <View style={styles.colTitle}>
              <Text style={styles.tableCellHeader}>Internal Name</Text>
            </View>
            <View style={styles.colName}>
              <Text style={styles.tableCellHeader}>Display Name</Text>
            </View>
            <View style={styles.colDesc}>
              <Text style={styles.tableCellHeader}>Short Description</Text>
            </View>
            <View style={styles.colAnode}>
              <Text style={styles.tableCellHeader}>Anode</Text>
            </View>
            <View style={styles.colCathode}>
              <Text style={styles.tableCellHeader}>Cathode</Text>
            </View>
            <View style={styles.colCurrent}>
              <Text style={styles.tableCellHeader}>Current</Text>
            </View>
            <View style={styles.colDuration}>
              <Text style={styles.tableCellHeader}>Duration</Text>
            </View>
            <View style={styles.colStatus}>
              <Text style={styles.tableCellHeader}>Status</Text>
            </View>
          </View>

          {/* Data Rows */}
          {stimulations.map((stim, index) => {
            const params = stim.tes_stimulations_tdcs_parameters?.[0]?.tdcs_parameter || {};
            const currentMA = params.current != null ? `${(params.current / 100).toFixed(1)} mA` : '—';
            const durationMin = params.duration != null ? `${(params.duration / 60).toFixed(0)} min` : '—';
            const rowStyle = index % 2 === 0 ? styles.tableRowAlt : styles.tableRow;

            return (
              <View key={stim.guid || index} style={rowStyle}>
                <View style={styles.colTitle}>
                  <Text style={styles.tableCell}>{stim.title || '—'}</Text>
                </View>
                <View style={styles.colName}>
                  <Text style={styles.tableCell}>{stim.name || stim.title || '—'}</Text>
                </View>
                <View style={styles.colDesc}>
                  <Text style={styles.tableCellMuted}>{stim.short_description || '—'}</Text>
                </View>
                <View style={styles.colAnode}>
                  <Text style={styles.tableCell}>{params.anode || '—'}</Text>
                </View>
                <View style={styles.colCathode}>
                  <Text style={styles.tableCell}>{params.cathode || '—'}</Text>
                </View>
                <View style={styles.colCurrent}>
                  <Text style={styles.tableCell}>{currentMA}</Text>
                </View>
                <View style={styles.colDuration}>
                  <Text style={styles.tableCell}>{durationMin}</Text>
                </View>
                <View style={styles.colStatus}>
                  <Text style={{ ...styles.tableCell, color: stim.disabled === false ? '#22c55e' : '#94a3b8' }}>
                    {stim.disabled === false ? 'Active' : 'Inactive'}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Generated by Plato Dashboard</Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
};

export default StimulationsPdfDocument;
