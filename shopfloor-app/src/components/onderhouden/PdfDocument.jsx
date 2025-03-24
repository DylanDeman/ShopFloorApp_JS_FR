import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  image: {
    width: 236,
    height: 70,
    marginBottom: 10,
  },
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
    backgroundColor: '#f8f8f8',
  },
  container: {
    backgroundColor: '#ffffff',
    padding: 20,
    border: '1pt solid #e0e0e0',
    borderRadius: 5,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 12,
    color: '#777',
  },
  statusSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  siteSection: {
    flexDirection: 'column',
    marginBottom: 40,
  },
  statusLabel: {
    fontSize: 12,
    color: '#333',
    marginRight: 5,
  },
  statusValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'green',
  },
  section: {
    marginBottom: 20,
  },
  siteInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    width: '40%',
    fontWeight: 'bold',
    color: '#333',
  },
  value: {
    width: '58%',
    backgroundColor: '#f0f0f0',
    padding: 5,
    borderRadius: 4,
    color: '#555',
  },
  opmerkingenBox: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 4,
    color: '#333',
    minHeight: 60,
  },
  button: {
    padding: 12,
    backgroundColor: '#e53935',
    color: '#ffffff',
    textAlign: 'center',
    borderRadius: 4,
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 20,
  },
  footerNote: {
    marginTop: 10,
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
});

// Format the datetime for the start and end times
const formatDateTime = (datetime) => {
  return `${new Date(datetime).toLocaleDateString()} ${new Date(datetime).toLocaleTimeString()}`;
};

const PdfDocument = ({ data, base64Logo }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Onderhoudsrapport</Text>
            <Text style={styles.subTitle}>Machine: {data.machine.code}</Text>
          </View>

          <View style={styles.statusSection}>
            <Text style={styles.statusLabel}>Status:</Text>
            <Text
              style={[
                styles.statusValue,
                { color: data.status === 'DRAAIT' ? 'green' : 'red' },
              ]}
            >
              {data.rawStatus}
            </Text>
          </View>

          {/* Site Section */}
          <View style={styles.siteSection}>
            <Text style={styles.title}>Site</Text>
            
            {/* Site Name */}
            <View style={styles.siteInfoRow}>
              <Text style={styles.label}>Naam</Text>
              <Text style={styles.value}>{data.machine.site.naam}</Text>
            </View>

            {/* Responsible Person */}
            <View style={styles.siteInfoRow}>
              <Text style={styles.label}>Verantwoordelijke</Text>
              <Text style={styles.value}>
                {`${data.machine.site.verantwoordelijke.voornaam} ${data.machine.site.verantwoordelijke.naam}`}
              </Text>
            </View>

            {/* Site Address (if available) */}
            {data.machine.site.adres && (
              <View style={styles.siteInfoRow}>
                <Text style={styles.label}>Adres</Text>
                <Text style={styles.value}>{data.machine.site.adres}</Text>
              </View>
            )}
          </View>

          {/* Maintenance Details Section */}
          <View style={styles.section}>
            <Text style={styles.title}>Details onderhoud</Text>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Nr.</Text>
              <Text style={styles.value}>{data.id}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Starttijdstip</Text>
              <Text style={styles.value}>{formatDateTime(data.starttijdstip)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Eindtijdstip</Text>
              <Text style={styles.value}>{formatDateTime(data.eindtijdstip)}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Technieker</Text>
              <Text style={styles.value}>{data.technieker}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Reden</Text>
              <Text style={styles.value}>{data.reden}</Text>
            </View>

            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Opmerkingen</Text>
            <Text style={styles.opmerkingenBox}>{data.opmerkingen}</Text>
          </View>

          <Image src={base64Logo} style={styles.image} />
        </View>
      </Page>
    </Document>
  );
};

export default PdfDocument;
