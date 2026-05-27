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
  headerLeft: {
    flex: 1,
  },
  logo: {
    width: 120,
    height: 40,
    objectFit: 'contain',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 11,
    color: '#718096',
    marginBottom: 4,
  },
  table: {
    display: 'table',
    width: 'auto',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    borderBottomStyle: 'solid',
    minHeight: 30,
    alignItems: 'center',
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    borderBottomStyle: 'solid',
    backgroundColor: '#F7FAFC',
    minHeight: 30,
    alignItems: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4A6CF7',
    color: '#FFFFFF',
    fontWeight: 'bold',
    minHeight: 35,
    alignItems: 'center',
  },
  tableColName: {
    width: '20%',
    paddingLeft: 8,
    paddingRight: 8,
  },
  tableColEmail: {
    width: '25%',
    paddingLeft: 8,
    paddingRight: 8,
  },
  tableColTreatment: {
    width: '15%',
    paddingLeft: 8,
    paddingRight: 8,
    textAlign: 'center',
  },
  tableColDate: {
    width: '15%',
    paddingLeft: 8,
    paddingRight: 8,
    textAlign: 'center',
  },
  tableColStatus: {
    width: '10%',
    paddingLeft: 8,
    paddingRight: 8,
    textAlign: 'center',
  },
  tableCellHeader: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 10,
  },
  tableCell: {
    fontSize: 9,
    color: '#2D3748',
  },
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

const PatientsPdfDocument = ({ patients, clinicName, totalPatients, isFiltered, filterTerm }) => {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const logo = "https://www.platoscience.com/cdn/shop/files/LogoMedicalSketches-02_360x.png"

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Patients Report</Text>
            <Text style={styles.subtitle}>Clinic: {clinicName}</Text>
            <Text style={styles.subtitle}>Generated: {currentDate}</Text>
            <Text style={styles.subtitle}>Total Patients: {totalPatients}</Text>
            {isFiltered && (
              <Text style={styles.subtitle}>Filter Applied: "{filterTerm}"</Text>
            )}
          </View>
          <Image style={styles.logo} src={logo} />
        </View>

        {/* Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <View style={styles.tableColName}>
              <Text style={styles.tableCellHeader}>Name</Text>
            </View>
            <View style={styles.tableColEmail}>
              <Text style={styles.tableCellHeader}>Email</Text>
            </View>
            <View style={styles.tableColTreatment}>
              <Text style={styles.tableCellHeader}>Active Treatment</Text>
            </View>
            <View style={styles.tableColDate}>
              <Text style={styles.tableCellHeader}>Created At</Text>
            </View>
            <View style={styles.tableColDate}>
              <Text style={styles.tableCellHeader}>Updated At</Text>
            </View>
            <View style={styles.tableColStatus}>
              <Text style={styles.tableCellHeader}>Status</Text>
            </View>
          </View>

          {/* Table Rows */}
          {patients.map((patient, index) => {
            const isEven = index % 2 === 0;
            const rowStyle = isEven ? styles.tableRowAlt : styles.tableRow;
            
            return (
              <View key={patient.guid || index} style={rowStyle}>
                <View style={styles.tableColName}>
                  <Text style={styles.tableCell}>{patient.name || '—'}</Text>
                </View>
                <View style={styles.tableColEmail}>
                  <Text style={styles.tableCell}>{patient.email || '—'}</Text>
                </View>
                <View style={styles.tableColTreatment}>
                  <Text style={styles.tableCell}>
                    {patient.patient_treatments?.some((t) => !t.disabled) ? 'Yes' : 'No'}
                  </Text>
                </View>
                <View style={styles.tableColDate}>
                  <Text style={styles.tableCell}>
                    {patient.createdAt 
                      ? new Date(patient.createdAt).toLocaleDateString('en-US')
                      : '—'}
                  </Text>
                </View>
                <View style={styles.tableColDate}>
                  <Text style={styles.tableCell}>
                    {patient.updatedAt 
                      ? new Date(patient.updatedAt).toLocaleDateString('en-US')
                      : '—'}
                  </Text>
                </View>
                <View style={styles.tableColStatus}>
                  <Text style={styles.tableCell}>
                    {patient.disabled === false ? 'Active' : 'Inactive'}
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

export default PatientsPdfDocument;
