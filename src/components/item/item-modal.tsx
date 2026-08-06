import React, { useEffect, useState } from 'react'
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Platform } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { postItem } from '@/services/items'
import { getCategories, Category } from '@/services/categories'
import { Item } from '@/models/item'

interface ItemModalProps {
  visible: boolean
  gatheringId: string
  item?: Item
  onClose: () => void
  onSave: (savedItem: Item) => void
}

export const ItemModal: React.FC<ItemModalProps> = ({ visible, gatheringId, onClose, item, onSave }) => {
  const [name, setName] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [isFetchingCategories, setIsFetchingCategories] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const isEditMode = !!item;

  useEffect(() => {
    if (visible) {
      setName(item?.name || '')
      setCategoryId(item?.category_id || '')

      const loadCategories = async () => {
        setIsFetchingCategories(true)
        const { data, error } = await getCategories()
        setIsFetchingCategories(false)

        if (error || !data) {
          setErrorMsg('Failed to load categories.')
          return
        }

        setCategories(data)
        if (data.length > 0 && !item?.category_id) {
          setCategoryId(data[0].id)
        }
      }

      loadCategories()
    } else {
      setName('')
      setCategoryId('')
      setErrorMsg(null)
    }
  }, [visible, item])

  const handleSubmit = async () => {
    if (!name.trim()) {
      setErrorMsg('Please enter an item name.')
      return
    }

    if (!categoryId) {
      setErrorMsg('Please select a category.')
      return
    }

    setIsLoading(true)
    setErrorMsg(null)

    if (isEditMode && item) {
      const payload: Item = {
        ...item,
        name: name.trim(),
        category_id: categoryId,
      }
      const { data, error } = await putItem(payload)
      setIsLoading(false)

      if (error || !data) {
        setErrorMsg(error?.message || 'Failed to update item.')
        return
      }
      onSave(data as Item)
    } else {
      const payload: Partial<Item> = {
        name: name.trim(),
        category_id: categoryId,
        gathering_id: gatheringId,
      }
      const { data, error } = await postItem(payload as Item)
      setIsLoading(false)

      if (error || !data) {
        setErrorMsg(error?.message || 'Failed to add item.')
        return
      }
      onSave(data as Item)
    }
    
    onClose()
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{isEditMode ? 'Edit Item' : 'Add New Item'}</Text>

          {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}

          <Text style={styles.label}>Item Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Ribeye Steak"
          />

          <Text style={styles.label}>Category</Text>
          {isFetchingCategories ? (
            <ActivityIndicator style={styles.loader} color="#4f46e5" size="small" />
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={categoryId}
                onValueChange={(itemValue) => setCategoryId(itemValue)}
                style={styles.picker}
                itemStyle={styles.pickerItem}
              >
                {categories.map((cat) => (
                  <Picker.Item key={cat.id} label={cat.name} value={cat.id} color="#111827" />
                ))}
              </Picker>
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose} disabled={isLoading}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.submitButton} 
              onPress={handleSubmit} 
              disabled={isLoading || isFetchingCategories}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitText}>{isEditMode ? 'Save Changes' : 'Add Item'}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 384,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111827',
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#f9fafb',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    backgroundColor: '#f9fafb',
    // Remove overflow: 'hidden' on iOS so the native wheel isn't clipped
    overflow: Platform.OS === 'ios' ? 'visible' : 'hidden',
  },
  picker: {
    width: '100%',
    // iOS requires dynamic height for the wheel picker
    height: Platform.OS === 'ios' ? 90 : 50,
  },
  pickerItem: {
    // Styling specifically for iOS wheel items
    height: 90,
    fontSize: 16,
    color: '#111827',
  },
  loader: {
    marginVertical: 12,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  cancelText: {
    color: '#4b5563',
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#ff385c',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  submitText: {
    color: '#ffffff',
    fontWeight: '600',
  },
})