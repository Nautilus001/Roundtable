import React, { useState } from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { Item } from '@/models/item'
import { putItem } from '@/services/items'
import { useGatheringContext } from '@/hooks/use-gathering-context'

interface ItemTileProps {
  item: Item;
  canEdit: boolean;
  onItemUpdated?: (updatedItem: Item) => void; 
  onItemRemoved?: (removedItem: Item) => void; 
}

export const ItemTile: React.FC<ItemTileProps> = ({ item, onItemUpdated, onItemRemoved, canEdit = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [editName, setEditName] = useState(item.name);
  const [editCategoryId, setEditCategoryId] = useState(item.category_id);
  const { removeItem } = useGatheringContext();

  const formattedDate = new Date(item.created_at || Date.now()).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleSave = async () => {
    setIsSaving(true);
    
    const updatedPayload: Item = {
      ...item,
      name: editName,
      category_id: editCategoryId,
    };

    const { data, error } = await putItem(updatedPayload);
    
    setIsSaving(false);

    if (error) {
      console.error('Failed to save item:', error.message);
      Alert.alert('Error', 'Failed to save item updates.');
      return;
    }

    setIsEditing(false);
    if (onItemUpdated && data) {
      onItemUpdated(data as Item);
    }
  };

  const handleCancel = () => {
    setEditName(item.name);
    setEditCategoryId(item.category_id);
    setIsEditing(false);
  };

  const executeRemove = async () => {
  setIsDeleting(true);
  try {
    await removeItem(item);
    if (onItemRemoved) {
      onItemRemoved(item);
    }
  } catch (error: any) {
    console.error("Error removing item: ", error.message);
    Alert.alert('Error', error.message || 'Failed to remove item.');
    setIsDeleting(false);
  }
};

  const handleRemove = () => {
    Alert.alert(
      "Remove Item",
      `Are you sure you want to remove "${item.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: executeRemove }
      ]
    );
  };

  if (isEditing) {
    return (
      <View style={styles.tile}>
        <View style={styles.header}>
          <Text style={styles.title}>Edit Item</Text>
        </View>

        <View style={styles.details}>
          <Text style={styles.label}>Name:</Text>
          <TextInput 
            style={styles.input}
            value={editName}
            onChangeText={setEditName}
            placeholder="Item Name"
            autoFocus
          />

          <Text style={styles.label}>Category ID:</Text>
          <TextInput 
            style={styles.input}
            value={editCategoryId}
            onChangeText={setEditCategoryId}
            placeholder="Category UUID"
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={handleCancel} style={styles.cancelButton} disabled={isSaving}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSave} style={styles.saveButton} disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.tile}>
      <View style={styles.header}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.actionsContainer}>
          {isDeleting ? (
            <ActivityIndicator size="small" color="#ff2020" />
          ) : (
            canEdit && (
              <>
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Text style={styles.editAction}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleRemove}>
                  <Text style={styles.removeAction}>Remove</Text>
                </TouchableOpacity>
              </>
            )
          )}
        </View>
      </View>

      <Text style={styles.date}>Added: {formattedDate}</Text>
    </View>
  );
}

export default ItemTile;

const styles = StyleSheet.create({
  tile: {
    padding: 16,
    maxWidth: 384,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  actionsContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 12, // Clean 12px vertical spacing between Edit and Remove
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1, // Ensures long names wrap naturally without pushing actions off-screen
    marginRight: 8,
  },
  editAction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4f46e5',
  },
  removeAction: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ff2020',
  },
  date: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginTop: 8,
  },
  details: {
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    color: '#9ca3af',
    fontSize: 12,
    marginBottom: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#f9fafb',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#4b5563',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});