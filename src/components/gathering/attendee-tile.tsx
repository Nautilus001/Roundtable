import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

interface AttendeeTileProps {
  name: string
  role: string
}

export const AttendeeTile: React.FC<AttendeeTileProps> = ({ name, role }) => {
  
  const getBadgeColors = (roleType: string) => {
    switch (roleType) {
      case 'OWNER':
        return { bg: '#e0e7ff', text: '#4338ca' } 
      case 'JUDGE':
        return { bg: '#fef3c7', text: '#b45309' } 
      case 'VOTER':
        return { bg: '#d1fae5', text: '#047857' }
      default:
        return { bg: '#f3f4f6', text: '#374151' } 
    }
  }

  const badgeStyle = getBadgeColors(role)

  return (
    <View style={styles.attendeeRow}>
      <Text style={styles.detailItem}>
        {name}
      </Text>
      <View style={[styles.roleBadge, { backgroundColor: badgeStyle.bg }]}>
        <Text style={[styles.roleBadgeText, { color: badgeStyle.text }]}>
          {role}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  attendeeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 1,
    elevation: 1,
  },
  detailItem: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
})

export default AttendeeTile