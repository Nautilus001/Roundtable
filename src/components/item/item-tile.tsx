// src/components/item/item-tile.tsx
import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { Item } from '@/models/item'
import { useGatheringContext } from '@/hooks/use-gathering-context'
import { ItemModal } from '@/components/item/item-modal' // <-- Import the new modal

interface ItemTileProps {
  item: Item;
  canEdit: boolean;
  onItemUpdated?: (updatedItem: Item) => void; 
  onItemRemoved?: (removedItem: Item) => void; 
}

export const ItemTile: React.FC<ItemTileProps> = ({ item, onItemUpdated, onItemRemoved, canEdit = true }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  
  const { removeItem } = useGatheringContext();

  const formattedDate = new Date(item.created_at || Date.now()).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

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

  const handleEditSaved = (updatedItem: Item) => {
    if (onItemUpdated) onItemUpdated(updatedItem);
  }

  return (
    <>
      <View style={styles.tile}>
        <View style={styles.header}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.actionsContainer}>
            {isDeleting ? (
              <ActivityIndicator size="small" color="#ff2020" />
            ) : (
              canEdit && (
                <>
                  {/* Triggers Modal */}
                  <TouchableOpacity onPress={() => setIsEditModalVisible(true)}>
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

      {/* Embedded Modal Component */}
      <ItemModal
        visible={isEditModalVisible}
        gatheringId={item.gathering_id as string} // Assuming your item has a gathering_id
        item={item} // <-- Triggers Edit Mode in the modal
        onClose={() => setIsEditModalVisible(false)}
        onSave={handleEditSaved}
      />
    </>
  );
}

export default ItemTile;

// Cleaned up styles (removed inline-edit related styles)
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
    gap: 12, 
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    flex: 1,
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
});