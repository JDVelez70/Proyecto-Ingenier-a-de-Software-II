import tensorflow as tf
import subprocess
import sys
import os

H5_PATH = "plant_model.h5"
TFJS_PATH = "plant_model_tfjs"

def train_model():
    # 1. Cargar datos
    IMG_SIZE = (224, 224)
    BATCH_SIZE = 32

    train_ds = tf.keras.utils.image_dataset_from_directory(
        "./Rice_leaf_disease/Training_data", image_size=IMG_SIZE, batch_size=BATCH_SIZE
    )
    val_ds = tf.keras.utils.image_dataset_from_directory(
        "./Rice_leaf_disease/Validation_data", image_size=IMG_SIZE, batch_size=BATCH_SIZE
    )

    # 2. Normalizar y mejorar rendimiento
    AUTOTUNE = tf.data.AUTOTUNE
    train_ds = train_ds.map(lambda x, y: (x / 255.0, y)).prefetch(buffer_size=AUTOTUNE)
    val_ds = val_ds.map(lambda x, y: (x / 255.0, y)).prefetch(buffer_size=AUTOTUNE)

    # 3. Crear modelo base (MobileNetV2)
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=IMG_SIZE + (3,),
        include_top=False,
        weights="imagenet"
    )
    base_model.trainable = False

    model = tf.keras.Sequential([
        base_model,
        tf.keras.layers.GlobalAveragePooling2D(),
        tf.keras.layers.Dense(8, activation="softmax")  # Cambia 8 por tu número de clases
    ])

    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )

    # 4. Entrenar
    model.fit(train_ds, validation_data=val_ds, epochs=5)

    # 5. Guardar modelo Keras (.h5)
    model.save(H5_PATH)
    print(f"Modelo Keras guardado en {H5_PATH}")


def convert_tflite():
    # Cargar el modelo Keras
    model = tf.keras.models.load_model(H5_PATH)
    
    # Convertir a TFLite
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    tflite_model = converter.convert()
    
    # Guardar archivo .tflite
    with open("plant_model.tflite", "wb") as f:
        f.write(tflite_model)
    
    print("Modelo convertido a TensorFlow Lite: plant_model.tflite")

if __name__ == "__main__":
    if os.path.exists(H5_PATH):
        print(f"{H5_PATH} ya existe. Saltando entrenamiento y convirtiendo a TFJS...")
        convert_tflite()
    else:
        print(f"{H5_PATH} no existe. Entrenando modelo...")
        train_model()

    # Convertir a tflite
    