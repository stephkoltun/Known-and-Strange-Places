//
//  ViewController.swift
//  Still-Life
//
//  Created by Patrick Burke on 2018-03-18.
//  Copyright © 2018 Patrick Burke. All rights reserved.
//

import UIKit
import SceneKit
import ARKit
import VideoToolbox

// Class is "ViewController"
// Inherits from "UIViewController", etc.
class ViewController: UIViewController, ARSCNViewDelegate, ARSessionDelegate
{

    // "@IBOutlet" allows the use of outlets and actions in Swift to connect the source code to interface objects
    // "sceneView" is an instance of the "ARSCNView" class
    // "!" is an implicitly unwrapped optional
    @IBOutlet var sceneView: ARSCNView!
    
    // Function inherited from UIKit
    // "Override" inherited characteristics to perform additional initializations
    override func viewDidLoad()
    {
        super.viewDidLoad()
        
        // Set the view's delegate
        // Enables a class or struc to hand off some of its responsibilities to an instance of another type
        sceneView.delegate = self
        
        // Set the session's delegate
        sceneView.session.delegate = self
        
        // Show statistics such as fps and timing information
        sceneView.showsStatistics = false
        
        // Create a new scene
        // 3D SceneKit view
        let scene = SCNScene()
        
        // Set the scene to the view
        sceneView.scene = scene
        
        let tapGesture = UITapGestureRecognizer(target: self, action:
            #selector(ViewController.handleTap(gestureRecognize:)))
        view.addGestureRecognizer(tapGesture)
        
    }
    
    // Makes func available to Objective-C
    // "handleTap" is the function
    // "gestureRecognize" is the parameter name
    // "UITapGestureRecognizer" is the parameter type
    // Function doesn't return anything
    @objc
    func handleTap(gestureRecognize: UITapGestureRecognizer){
        guard let currentARFrame = sceneView.session.currentFrame else {
            return
        }
        let buffer = currentARFrame.capturedImage
        
        var cgImage: CGImage?
        VTCreateCGImageFromCVPixelBuffer(buffer, nil, &cgImage)
        
        // Create an image plane using a snapshot of the view
        let imagePlane = SCNPlane(width: sceneView.bounds.width / 1500,
                                  height: sceneView.bounds.height / 1500)
        imagePlane.firstMaterial?.isDoubleSided = true
        imagePlane.firstMaterial?.diffuse.contents = cgImage
        imagePlane.firstMaterial?.lightingModel = .constant
        
        // Create a plane node and add it to the scene
        let planeNode = SCNNode(geometry: imagePlane)
        sceneView.scene.rootNode.addChildNode(planeNode)
        
        // Set transform of node to be 10cm in front of camera
        var translation = matrix_identity_float4x4
        translation.columns.3.z = -0.01
        planeNode.simdTransform = matrix_multiply(currentARFrame.camera.transform, translation)
    }
    
    // Function with one parameter
    // "Override" inherited characteristics
    override func viewWillAppear(_ animated: Bool)
    {
        super.viewWillAppear(animated)
        
        // Create a session configuration
        let configuration = ARWorldTrackingConfiguration()

        // Run the view's session
        sceneView.session.run(configuration)
    }
    
    // Function with one parameter
    // "Override" inherited characteristics
    override func viewWillDisappear(_ animated: Bool)
    {
        super.viewWillDisappear(animated)
        
        // Pause the view's session
        sceneView.session.pause()
    }
    
    override func didReceiveMemoryWarning()
    {
        super.didReceiveMemoryWarning()
        // Release any cached data, images, etc that aren't in use.
    }


    // MARK: - ARSCNViewDelegate
    
/*
    // Override to create and configure nodes for anchors added to the view's session.
    func renderer(_ renderer: SCNSceneRenderer, nodeFor anchor: ARAnchor) -> SCNNode? {
        let node = SCNNode()
     
        return node
    }
*/
    
    func session(_ session: ARSession, didFailWithError error: Error)
    {
        // Present an error message to the user
        
    }
    
    func sessionWasInterrupted(_ session: ARSession)
    {
        // Inform the user that the session has been interrupted, for example, by presenting an overlay
        
    }
    
    func sessionInterruptionEnded(_ session: ARSession)
    {
        // Reset tracking and/or remove existing anchors if consistent tracking is required
        
    }
}
